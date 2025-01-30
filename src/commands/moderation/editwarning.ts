import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { Command } from '../../interfaces/command';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

const EditWarning: Command = {
  data: new SlashCommandBuilder()
    .setName('editwarning')
    .setDescription('Edit the reason for a given warning')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addIntegerOption((option) =>
      option.setName('id').setDescription('The ID of the warning to edit').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('newmessage').setDescription('The new warning message').setRequired(true)
    ),

  async run(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    const warningIdOption = interaction.options.getInteger('id', true);
    const newMessageOption = interaction.options.getString('newmessage', true);

    try {
      const updatedWarning = await prisma.warn.update({
        where: { id: warningIdOption },
        data: { reason: newMessageOption },
      });

      await interaction.reply({ content: `Warning ID ${updatedWarning.id} has been updated.`, ephemeral: true });
    } catch (error) {
      logger.error('Error updating the warning:', error);
      let errorMessage = 'An error occurred while updating the warning.';

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        errorMessage = 'Warning not found.';
      }

      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  },
};

export default EditWarning;
