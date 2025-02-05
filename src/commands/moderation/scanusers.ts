import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  GuildMember,
  Guild,
  TextChannel,
  EmbedBuilder,
  ChannelType,
} from 'discord.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { Command } from '../../interfaces/command';
import logger from '../../utils/logger';
import { assessAndWarnHighRiskUser } from '../../utils/riskScoring';
import Config from '../../config';

const prisma = new PrismaClient();
const SUSPICIOUS_PATTERNS = [/\d{4}$/, /^[a-zA-Z]\d{7}$/, /(.)\1{4,}/, /^[a-zA-Z0-9]+(bot|spam)$/i];

const ScanUsers: Command = {
  data: new SlashCommandBuilder()
    .setName('scanusers')
    .setDescription('Scan server members for potential spam accounts')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addStringOption((option) =>
      option
        .setName('filter')
        .setDescription('Scan filter')
        .setRequired(true)
        .addChoices(
          { name: 'New Joins (24h)', value: 'new' },
          { name: 'No Messages', value: 'silent' },
          { name: 'Suspicious Names', value: 'names' },
          { name: 'High Risk', value: 'risk' }
        )
    )
    .addIntegerOption((option) =>
      option.setName('limit').setDescription('Maximum number of users to scan (default 1000)').setRequired(false)
    ),

  async run(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const filter = interaction.options.getString('filter', true);
      const limit = Math.min(interaction.options.getInteger('limit') || 1000, 5000);
      const logChannel = interaction.guild.channels.cache.get(Config.LOG_CHANNEL) as TextChannel;

      if (!logChannel || logChannel.type !== ChannelType.GuildText) {
        await interaction.editReply('Unable to find the configured log channel.');
        return;
      }

      if (filter === 'risk') {
        await interaction.editReply('Starting risk assessment scan. This may take a while...');
      }

      const scanStartTime = Date.now();
      const results = await scanUsers(interaction.guild, filter, limit, interaction);

      if (results.length === 0) {
        await interaction.editReply(`No suspicious users found using filter: ${filter}`);
        return;
      }

      const summaryEmbed = createSummaryEmbed(results, filter, scanStartTime);

      await sendDetailedResults(logChannel, results, filter, interaction.user.tag);
      await interaction.editReply({
        content: `Scan complete! Detailed results have been sent to ${logChannel}`,
        embeds: [summaryEmbed],
      });
    } catch (error) {
      logger.error('Error in scanusers command:', error);
      await interaction.editReply('An error occurred while scanning users. Please try again later.');
    }
  },
};

function createSummaryEmbed(
  results: Array<{ member: GuildMember; risk: number; reason: string }>,
  filter: string,
  startTime: number
): EmbedBuilder {
  const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);

  const reasonCounts = results.reduce(
    (acc, { reason }) => {
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const embed = new EmbedBuilder()
    .setTitle('Scan Summary')
    .setColor('#ff9900')
    .setDescription(`Filter: ${filter}\nTotal suspicious users: ${results.length}`)
    .addFields(
      { name: 'Execution Time', value: `${executionTime} seconds`, inline: true },
      {
        name: 'Average Risk Score',
        value: (results.reduce((acc, r) => acc + r.risk, 0) / results.length).toFixed(2),
        inline: true,
      }
    )
    .setTimestamp();

  for (const [reason, count] of Object.entries(reasonCounts)) {
    embed.addFields({ name: reason, value: count.toString(), inline: true });
  }

  return embed;
}

async function sendDetailedResults(
  channel: TextChannel,
  results: Array<{ member: GuildMember; risk: number; reason: string }>,
  filter: string,
  initiator: string
) {
  await channel.send({
    embeds: [new EmbedBuilder()
      .setTitle('Detailed Scan Results')
      .setDescription(`Filter: ${filter}\nInitiated by: ${initiator}\nTotal results: ${results.length}`)
      .setColor('#ff9900')
      .setTimestamp()]
  });

  const USERS_PER_EMBED = 10;
  const totalEmbeds = Math.ceil(results.length / USERS_PER_EMBED);

  for (let i = 0; i < results.length; i += USERS_PER_EMBED) {
    const batch = results.slice(i, i + USERS_PER_EMBED);
    const embedNumber = Math.floor(i / USERS_PER_EMBED) + 1;
    
    const batchEmbed = new EmbedBuilder()
      .setTitle(`Results (Page ${embedNumber}/${totalEmbeds})`)
      .setDescription(`Users ${i + 1}-${Math.min(i + USERS_PER_EMBED, results.length)} of ${results.length}`)
      .setColor('#ff9900');

    batch.forEach((result, index) => {
      batchEmbed.addFields({
        name: `${i + index + 1}. ${result.member.user.tag}`,
        value: [
          `ID: ${result.member.id}`,
          `Risk Score: ${result.risk}`,
          `Reason: ${result.reason}`,
          `Joined: ${result.member.joinedAt?.toLocaleString() || 'Unknown'}`,
          `Account Created: ${result.member.user.createdAt.toLocaleString()}`
        ].join('\n')
      });
    });

    await channel.send({ embeds: [batchEmbed] });
    
    if (embedNumber < totalEmbeds) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  await channel.send({
    embeds: [new EmbedBuilder()
      .setTitle('End of Results')
      .setDescription(`Completed sending ${results.length} results across ${totalEmbeds} pages.`)
      .setColor('#ff9900')
      .setTimestamp()]
  });
}

async function getOrCreateUser(userId: string): Promise<{ messageCount: number; riskScore: number } | null> {
  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { messageCount: true, riskScore: true },
    });

    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            id: userId,
            warns: 0,
            timeouts: 0,
            messageCount: 0,
            riskScore: 0,
          },
          select: { messageCount: true, riskScore: true },
        });
      } catch (createError) {
        if (createError instanceof Prisma.PrismaClientKnownRequestError) {
          // P2002 is for unique constraint violations
          if (createError.code === 'P2002') {
            user = await prisma.user.findUnique({
              where: { id: userId },
              select: { messageCount: true, riskScore: true },
            });
          }
        }
        if (!user) {
          logger.error(`Failed to create/fetch user ${userId}:`, createError);
          return null;
        }
      }
    }

    return user;
  } catch (error) {
    logger.error(`Database error for user ${userId}:`, error);
    return null;
  }
}

async function scanUsers(
  guild: Guild,
  filter: string,
  limit: number,
  interaction?: ChatInputCommandInteraction
): Promise<Array<{ member: GuildMember; risk: number; reason: string }>> {
  const now = Date.now();
  const suspiciousUsers: Array<{ member: GuildMember; risk: number; reason: string }> = [];

  try {
    await interaction?.editReply('Fetching members...');
    const members = await guild.members.fetch({ limit });
    const memberArray = Array.from(members.values());
    const totalMembers = memberArray.length;

    logger.info(`Starting scan with filter: ${filter}, total members: ${totalMembers}`);
    await interaction?.editReply(`Found ${totalMembers} members to scan. Starting scan...`);

    for (let i = 0; i < memberArray.length; i++) {
      if (suspiciousUsers.length >= limit) break;

      const member = memberArray[i];
      if (member.user.bot) continue;

      if (interaction && i % 5 === 0) {
        const progress = Math.round((i / totalMembers) * 100);
        await interaction
          .editReply(
            `Scanning users: ${progress}% complete (${i}/${totalMembers})\nSuspicious users found: ${suspiciousUsers.length}`
          )
          .catch((error) => logger.error('Failed to update progress:', error));
      }

      try {
        switch (filter) {
          case 'new':
            const joinTime = member.joinedTimestamp || 0;
            const hoursSinceJoin = (now - joinTime) / (1000 * 60 * 60);
            if (hoursSinceJoin <= 24) {
              suspiciousUsers.push({ member, risk: 1, reason: 'New join' });
              logger.debug(`Found new join: ${member.user.tag}`);
            }
            break;

          case 'silent':
            const userData = await getOrCreateUser(member.id);
            if (userData?.messageCount === 0) {
              suspiciousUsers.push({ member, risk: 2, reason: 'No messages' });
              logger.debug(`Found silent user: ${member.user.tag}`);
            }
            break;

          case 'names':
            if (SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(member.user.username))) {
              suspiciousUsers.push({ member, risk: 2, reason: 'Suspicious username' });
              logger.debug(`Found suspicious username: ${member.user.tag}`);
            }
            break;

          case 'risk':
            logger.debug(`Assessing risk for user: ${member.user.tag}`);
            await assessAndWarnHighRiskUser(member, guild);

            const userRisk = await getOrCreateUser(member.id);
            if (userRisk && userRisk.riskScore > 3) {
              suspiciousUsers.push({
                member,
                risk: userRisk.riskScore,
                reason: 'High risk score',
              });
              logger.debug(`Found high risk user: ${member.user.tag} (Score: ${userRisk.riskScore})`);
            }

            await new Promise((resolve) => setTimeout(resolve, 500));
            break;
        }
      } catch (memberError) {
        logger.error(`Error processing member ${member.id} with filter ${filter}:`, memberError);
        continue;
      }
    }

    logger.info(`Scan complete. Found ${suspiciousUsers.length} suspicious users`);
    await interaction?.editReply('Scan complete! Preparing results...');

    return suspiciousUsers.sort((a, b) => b.risk - a.risk);
  } catch (error) {
    logger.error('Error during scan:', error);
    throw error;
  }
}

export default ScanUsers;
