import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../interfaces/command';

const Framework: Command = {
  data: new SlashCommandBuilder()
    .setName('framework')
    .setDescription('Get an invite link to the selected framework Discord')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Framework name')
        .setRequired(true)
        .addChoices({ name: 'esx', value: 'esx' }, { name: 'qb', value: 'qbcore' })
    ),
  run: async (interaction) => {
    switch (interaction.options.getString('name')) {
      case 'qbcore':
        return interaction.reply('https://discord.gg/qbcore');
      case 'esx':
        return interaction.reply('https://discord.com/invite/VKX6DHVyhV');
    }
  },
};

export default Framework;
