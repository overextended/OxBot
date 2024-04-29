import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/command';

const CoinFlip: Command = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin to get heads or tails'),
  run: async (interaction: CommandInteraction) => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    await interaction.reply(`The coin flip result is... **${result}**!`);
  },
};

export default CoinFlip;
