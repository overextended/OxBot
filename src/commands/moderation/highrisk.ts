import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Command } from '../../interfaces/command';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

const HighRisk: Command = {
  data: new SlashCommandBuilder()
    .setName('highrisk')
    .setDescription('List users with high risk scores')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addIntegerOption((option) =>
      option
        .setName('threshold')
        .setDescription('Minimum risk score to include (default 75)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .addIntegerOption((option) =>
      option
        .setName('limit')
        .setDescription('Maximum number of users to show (default 25)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(100)
    ),

  async run(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const threshold = interaction.options.getInteger('threshold') || 75;
      const limit = interaction.options.getInteger('limit') || 25;

      const highRiskUsers = await prisma.user.findMany({
        where: {
          riskScore: {
            gte: threshold,
          },
        },
        orderBy: {
          riskScore: 'desc',
        },
        take: limit,
      });

      if (highRiskUsers.length === 0) {
        await interaction.editReply(`No users found with risk score ≥ ${threshold}%`);
        return;
      }

      const memberPromises = highRiskUsers.map((user) => interaction.guild!.members.fetch(user.id).catch(() => null));
      const members = await Promise.all(memberPromises);

      const embed = new EmbedBuilder()
        .setTitle('High Risk Users')
        .setColor('#ff0000')
        .setDescription(
          `**Risk Score Threshold:** ${threshold}%\n` +
            `**Total Users Found:** ${highRiskUsers.length}\n\n` +
            `__User Details:__`
        )
        .setTimestamp();

      for (let i = 0; i < highRiskUsers.length; i++) {
        const user = highRiskUsers[i];
        const member = members[i];

        if (!member) continue;

        const joinDuration = user.joinedAt
          ? Math.floor((Date.now() - user.joinedAt.getTime()) / (1000 * 60 * 60 * 24))
          : '?';

        const lastScanDuration = user.lastScan
          ? Math.floor((Date.now() - user.lastScan.getTime()) / (1000 * 60 * 60))
          : '?';

        embed.addFields({
          name: `${i + 1}. ${member.user.tag}`,
          value: [
            `Risk Score: **${user.riskScore}%**`,
            `Messages: ${user.messageCount}`,
            `Warns: ${user.warns}`,
            `Time in Server: ${joinDuration} days`,
            `Last Scan: ${lastScanDuration} hours ago`,
            `ID: ${user.id}`,
          ].join('\n'),
          inline: false,
        });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      logger.error('Error in highrisk command:', error);
      await interaction.editReply('An error occurred while fetching high-risk users.');
    }
  },
};

export default HighRisk;
