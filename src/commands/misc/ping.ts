import { Command } from '../../interfaces/command';
import { SlashCommandBuilder } from 'discord.js';

const Ping: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Reply with Pong'),
  run: async (interaction) => {
    await interaction.reply('Pong!');
  },
};

export default Ping;
