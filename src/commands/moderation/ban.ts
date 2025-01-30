import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Command } from '../../interfaces/command';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

const Ban: Command = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => option.setName('user').setDescription('The user to ban').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('The reason for the ban').setRequired(false))
    .addIntegerOption((option) =>
      option
        .setName('delete_message_days')
        .setDescription('Number of days to delete messages for (0-7)')
        .setRequired(false)
    ),

  async run(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    const user = interaction.options.getUser('user', true);
    const reasonOption = interaction.options.getString('reason');
    const deleteMessageDaysOption = interaction.options.getInteger('delete_message_days');

    const reason = (reasonOption as string) || 'No reason provided';
    const deleteMessageDays = deleteMessageDaysOption || 0;

    if (!user) {
      await interaction.reply({ content: 'User not found!', ephemeral: true });
      return;
    }

    try {
      await interaction.guild.members.ban(user, { reason: reason, deleteMessageDays: deleteMessageDays });

      await prisma.ban.create({
        data: {
          reason: reason,
          issuerId: interaction.user.id,
          targetId: user.id,
        },
      });

      await interaction.reply({ content: `<@${user.id}> has been **banned**. Reason: ${reason}`, ephemeral: false });
    } catch (error) {
      logger.error(error);
      await interaction.reply({ content: 'An error occurred while processing the ban.', ephemeral: true });
    }
  },
};

export default Ban;
