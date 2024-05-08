import { SlashCommandBuilder, CommandInteraction, AttachmentBuilder } from 'discord.js';
import { Command } from '../../interfaces/command';
import path from 'path';

const NodeImage: Command = {
  data: new SlashCommandBuilder()
    .setName('node')
    .setDescription('Gottfried loves node.'),

  async run(interaction: CommandInteraction) {
    const imagePath = path.join(__dirname, '../../data/imgs/node.png');
    const imageAttachment = new AttachmentBuilder(imagePath);

    await interaction.reply({ files: [imageAttachment] });
  },
};

export default NodeImage;
