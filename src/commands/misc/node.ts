import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { Command } from '../../interfaces/command';

const NodeImage: Command = {
  data: new SlashCommandBuilder()
    .setName('node')
    .setDescription('Sends an image related to Node.js'),

  async run(interaction: CommandInteraction) {
    const imageUrl = 'https://i.imgur.com/9YFX9AR.png';
    await interaction.reply({ content: imageUrl });
  },
};

export default NodeImage;
