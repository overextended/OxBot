import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/command';

const Guild: Command = {
  data: new SlashCommandBuilder()
    .setName('guild')
    .setDescription('Get an invite link to the selected Guild')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Guild name')
        .setRequired(true)
        .addChoices(
          { name: 'ESX', value: 'esx' },
          { name: 'Qbox', value: 'qbox' },
          { name: 'project-error', value: 'project-error' },
          { name: 'txAdmin', value: 'txAdmin' },
          { name: 'Cfx.re', value: 'cfx' }
        )
    ),
  run: async (interaction) => {
    const guildName = interaction.options.get('name')?.value as string;

    switch (guildName) {
      case 'qbox':
        await interaction.reply('https://discord.gg/AtbwBuJHN5');
        break;
      case 'esx':
        await interaction.reply('https://discord.com/invite/RPX2GssV6r');
        break;
      case 'project-error':
        await interaction.reply('https://discord.gg/FbFXcM5rGz');
        break;
      case 'txAdmin':
        await interaction.reply('https://discord.gg/yWxjt9zPWR');
        break;
      case 'cfx':
        await interaction.reply('https://discord.gg/fivem');
        break;
      default:
        await interaction.reply({ content: 'Invalid guild selected.', ephemeral: true });
        break;
    }
  },
};

export default Guild;
