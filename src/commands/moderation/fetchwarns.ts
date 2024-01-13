import { SlashCommandBuilder, CommandInteraction, User } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Command } from '../../interfaces/command';

const prisma = new PrismaClient();

const FetchWarns: Command = {
  data: new SlashCommandBuilder()
    .setName('fetchwarns')
    .setDescription('Display the number of warns a user has')
    .addUserOption((option) => option.setName('user').setDescription('The user to check').setRequired(true)),

  async run(interaction: CommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    const userOption = interaction.options.getUser('user', true);

    try {
      const targetUser = await prisma.user.findUnique({
        where: { id: userOption.id },
      });

      if (!targetUser) {
        await interaction.reply({ content: `No warnings found for <@${userOption.id}>.`, ephemeral: true });
        return;
      }

      await interaction.reply({ content: `<@${userOption.id}> has ${targetUser.warns} warning(s).`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while fetching the warnings.', ephemeral: true });
    }
  },
};

export default FetchWarns;
