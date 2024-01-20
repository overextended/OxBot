import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } from 'discord.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { Command } from '../../interfaces/command';

const prisma = new PrismaClient();

const EditWarning: Command = {
  data: new SlashCommandBuilder()
    .setName('editwarning')
    .setDescription('Edit the reason for a given warning')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('The ID of the warning to edit')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('newmessage')
        .setDescription('The new warning message')
        .setRequired(true)),

  async run(interaction: CommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.KickMembers)) {
      await interaction.reply({ content: 'Insufficient permissions.', ephemeral: true });
      return;
    }

    const warningIdOption = interaction.options.get('id');
    const newMessageOption = interaction.options.get('newmessage');

    const warningId = warningIdOption ? parseInt(warningIdOption.value as string) : null;
    const newMessage = newMessageOption ? (newMessageOption.value as string) : null;

    if (warningId === null || newMessage === null) {
      await interaction.reply({ content: 'Invalid command usage.', ephemeral: true });
      return;
    }

    try {
      const updatedWarning = await prisma.warn.update({
        where: { id: warningId },
        data: { reason: newMessage },
      });

      await interaction.reply({ content: `Warning ID ${updatedWarning.id} has been updated.`, ephemeral: true });
    } catch (error) {
      console.error('Error updating the warning:', error);
      let errorMessage = 'An error occurred while updating the warning.';

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        errorMessage = 'Warning not found.';
      }

      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  },
};

export default EditWarning;
