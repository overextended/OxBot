import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Command } from '../../interfaces/command';

const prisma = new PrismaClient();

const FetchWarns: Command = {
  data: new SlashCommandBuilder()
    .setName('fetchwarns')
    .setDescription('Display all warnings for a specific user')
    .addUserOption((option) => option.setName('user').setDescription('The user to check').setRequired(true)),

  async run(interaction: CommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    const userOption = interaction.options.getUser('user', true);

    try {
      const warnings = await prisma.warn.findMany({
        where: { targetId: userOption.id },
        select: { id: true, reason: true },
      });

      if (warnings.length === 0) {
        await interaction.reply({ content: `No warnings found for <@${userOption.id}>.`, ephemeral: true });
        return;
      }

      const warningMessages = warnings.map((warn) => `ID: ${warn.id}, Reason: ${warn.reason}`).join('\n');
      await interaction.reply({ content: `Warnings for <@${userOption.id}>:\n${warningMessages}`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while fetching the warnings.', ephemeral: true });
    }
  },
};

export default FetchWarns;
