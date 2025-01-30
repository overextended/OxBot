import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Command } from '../../interfaces/command';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

const ClearWarn: Command = {
  data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('Clear warnings of a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option.setName('user').setDescription('The user whose warnings will be cleared').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('warnid')
        .setDescription('The warning ID to clear, or "all" to clear all warnings')
        .setRequired(true)
    ),

  async run(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    interaction.deferReply({ ephemeral: true });

    const userOption = interaction.options.getUser('user', true);
    const member: GuildMember | null = await interaction.guild.members.fetch(userOption.id).catch(() => null);

    if (!member) {
      await interaction.editReply('User not found in the guild.');
      return;
    }
    const warnIdOption = interaction.options.getString('warnid', true);

    try {
      if (warnIdOption.toLowerCase() === 'all') {
        // Clear all warnings
        await prisma.warn.deleteMany({ where: { targetId: userOption.id } });

        // Reset the warns count in User model
        await prisma.user.update({
          where: { id: userOption.id },
          data: { warns: 0 },
        });

        // Remove timeout if present
        if (member.communicationDisabledUntilTimestamp && member.communicationDisabledUntilTimestamp > Date.now()) {
          await member.timeout(null);
        }

        await interaction.editReply(`Cleared all warnings and removed timeout for <@${userOption.id}>.`);
      } else {
        // Clear specific warning
        const warnId = parseInt(warnIdOption);
        if (isNaN(warnId)) {
          await interaction.editReply('Invalid warning ID provided.');
          return;
        }

        const result = await prisma.warn.deleteMany({
          where: {
            id: warnId,
            targetId: userOption.id,
          },
        });

        if (result.count === 0) {
          await interaction.editReply('No warning found with the provided ID for this user.');
        } else {
          await interaction.editReply(`Cleared warning ID ${warnId} for <@${userOption.id}>.`);
        }
      }
    } catch (error) {
      logger.error(error);
      await interaction.editReply('An error occurred while clearing the warnings.');
    }
  },
};

export default ClearWarn;
