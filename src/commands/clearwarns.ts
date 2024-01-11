import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, User } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Command } from '../interfaces/command';

const prisma = new PrismaClient();

const ClearWarn: Command = {
  data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('Clear all warnings of a user')
    .addUserOption((option) =>
      option.setName('user').setDescription('The user whose warnings will be cleared').setRequired(true)
    ),

  async run(interaction: CommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.KickMembers)) {
      await interaction.reply({ content: 'Insufficient permissions.', ephemeral: true });
      return;
    }

    const userOption = interaction.options.getUser('user', true);

    try {
      await prisma.user.update({
        where: { id: userOption.id },
        data: { warns: 0 },
      });

      await prisma.warn.deleteMany({ where: { targetId: userOption.id } });

      await interaction.reply({ content: `Cleared all warnings for <@${userOption.id}>.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while clearing the warnings.', ephemeral: true });
    }
  },
};

export default ClearWarn;
