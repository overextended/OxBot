import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Command } from '../../interfaces/command';

const prisma = new PrismaClient();

const Ban: Command = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption((option) => option.setName('user').setDescription('The user to ban').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('The reason for the ban').setRequired(false))
    .addIntegerOption((option) =>
      option
        .setName('delete_message_days')
        .setDescription('Number of days to delete messages for (0-7)')
        .setRequired(false)
    ),

  async run(interaction: CommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ content: 'Insufficient permissions.', ephemeral: true });
      return;
    }

    const userOption = interaction.options.get('user');
    const reasonOption = interaction.options.get('reason');
    const deleteMessageDaysOption = interaction.options.get('delete_message_days');

    const user = userOption?.user;
    const reason = (reasonOption?.value as string) || 'No reason provided';
    const deleteMessageDays = deleteMessageDaysOption ? parseInt(deleteMessageDaysOption.value as string) : 0;

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

      await interaction.reply({ content: `Banned <@${user.id}>. Reason: ${reason}`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while processing the ban.', ephemeral: true });
    }
  },
};

export default Ban;
