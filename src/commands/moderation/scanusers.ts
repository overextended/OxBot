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
import { PrismaClient } from '@prisma/client';
import { Command } from '../../interfaces/command';
import logger from '../../utils/logger';
import { assessAndWarnHighRiskUser, calculateUsernameRiskScore } from '../../utils/riskScoring';
import Config from '../../config';

const prisma = new PrismaClient();

interface RiskCategory {
  range: string;
  users: Array<{ member: GuildMember; risk: number; reason: string }>;
  count: number;
}

interface RiskCategories {
  high: RiskCategory; // 75-100%
  medium: RiskCategory; // 50-74%
  low: RiskCategory; // 25-49%
  minimal: RiskCategory; // 0-24%
}

function categorizeResults(results: Array<{ member: GuildMember; risk: number; reason: string }>): RiskCategories {
  const categories: RiskCategories = {
    high: { range: '75-100%', users: [], count: 0 },
    medium: { range: '50-74%', users: [], count: 0 },
    low: { range: '25-49%', users: [], count: 0 },
    minimal: { range: '0-24%', users: [], count: 0 },
  };

  results.forEach((result) => {
    if (result.risk >= 75) {
      categories.high.users.push(result);
      categories.high.count++;
    } else if (result.risk >= 50) {
      categories.medium.users.push(result);
      categories.medium.count++;
    } else if (result.risk >= 25) {
      categories.low.users.push(result);
      categories.low.count++;
    } else {
      categories.minimal.users.push(result);
      categories.minimal.count++;
    }
  });

  return categories;
}

async function sendDetailedResults(
  channel: TextChannel,
  categories: RiskCategories,
  filter: string,
  initiator: string,
  executionTime: number,
  totalUsers: number
): Promise<void> {
  const totalHighMedium = categories.high.count + categories.medium.count;
  const totalLowMinimal = categories.low.count + categories.minimal.count;

  const embed = new EmbedBuilder()
    .setTitle('Scan Summary')
    .setColor(categories.high.count > 0 ? '#ff0000' : totalHighMedium > 0 ? '#ff9900' : '#00ff00')
    .setDescription(
      `**Filter:** ${filter}\n` +
        `**Total users scanned:** ${totalUsers}\n\n` +
        `**Execution Time:** ${executionTime.toFixed(2)} seconds\n\n` +
        `**Risk Distribution**\n` +
        `• High Risk (75-100%): ${categories.high.count} users\n` +
        `• Medium Risk (50-74%): ${categories.medium.count} users\n` +
        `• Lower Risk: ${totalLowMinimal} users below 50%`
    )
    .setFooter({ text: `Initiated by: ${initiator}` })
    .setTimestamp();

  await channel.send({ embeds: [embed] });
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
        if (filter === 'risk') {
          await prisma.user.upsert({
            where: { id: member.id },
            create: {
              id: member.id,
              warns: 0,
              timeouts: 0,
              messageCount: 0,
              joinedAt: member.joinedAt || new Date(),
              riskScore: 0,
              lastScan: new Date(),
            },
            update: {
              lastScan: new Date(),
            },
          });
        } else {
          await prisma.user.upsert({
            where: { id: member.id },
            create: {
              id: member.id,
              warns: 0,
              timeouts: 0,
              messageCount: 0,
              joinedAt: member.joinedAt || new Date(),
              riskScore: 0,
              lastScan: new Date(),
            },
            update: {
              lastScan: new Date(),
              joinedAt: member.joinedAt || undefined,
            },
          });
        }

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
            const userData = await prisma.user.findUnique({
              where: { id: member.id },
              select: { messageCount: true },
            });
            if (!userData || userData.messageCount === 0) {
              suspiciousUsers.push({ member, risk: 2, reason: 'No messages' });
              logger.debug(`Found silent user: ${member.user.tag}`);
            }
            break;

          case 'names':
            const usernameRisk = calculateUsernameRiskScore(member.user.username);
            if (usernameRisk.score > 0) {
              const riskScore = usernameRisk.score * 100;
              suspiciousUsers.push({
                member,
                risk: riskScore,
                reason: usernameRisk.factors[0] || 'Suspicious username pattern',
              });
              logger.debug(`Found suspicious username pattern: ${member.user.tag} (Score: ${riskScore})`);
            }
            break;

          case 'risk':
            logger.debug(`Assessing risk for user: ${member.user.tag}`);
            await assessAndWarnHighRiskUser(member, guild);

            const userRisk = await prisma.user.findUnique({
              where: { id: member.id },
              select: { riskScore: true },
            });

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

      const categories = categorizeResults(results);
      const executionTime = (Date.now() - scanStartTime) / 1000;
      const totalUsers = results.length;

      await sendDetailedResults(logChannel, categories, filter, interaction.user.tag, executionTime, totalUsers);

      const embed = new EmbedBuilder()
        .setTitle('Scan Summary')
        .setColor(
          categories.high.count > 0
            ? '#ff0000'
            : categories.high.count + categories.medium.count > 0
              ? '#ff9900'
              : '#00ff00'
        )
        .setDescription(
          `**Filter:** ${filter}\n` +
            `**Total users scanned:** ${totalUsers}\n\n` +
            `**Execution Time:** ${executionTime.toFixed(2)} seconds\n\n` +
            `**Risk Distribution**\n` +
            `• High Risk (75-100%): ${categories.high.count} users\n` +
            `• Medium Risk (50-74%): ${categories.medium.count} users\n` +
            `• Lower Risk: ${categories.low.count + categories.minimal.count} users below 50%`
        )
        .setTimestamp();

      await interaction.editReply({
        content: `Scan complete! Detailed results have been sent to ${logChannel}`,
        embeds: [embed],
      });
    } catch (error) {
      logger.error('Error in scanusers command:', error);
      await interaction.editReply('An error occurred while scanning users. Please try again later.');
    }
  },
};

export default ScanUsers;
