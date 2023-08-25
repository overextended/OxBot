import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command';

const Ox: Command = {
  data: new SlashCommandBuilder().setName('ox').setDescription('About Overextended'),
  run: async (interaction) => {
    await interaction.reply({ embeds: [oxEmbed()] });
  },
};

function oxEmbed() {
  const embed = new EmbedBuilder()
    .setTitle('Overextended')
    .setColor('#00ffff')
    .setDescription(
      'Overextended is a small group working to create open-source resources for FiveM, with focus on security, performance and stability.'
    )
    .setThumbnail('https://i.imgur.com/Rp4xZiU.png')
    .addFields(
      {
        name: 'Team',
        value: 'If you wish to donate to any of the group members, their donation links are listed below.',
      },
      {
        name: 'Linden',
        value: 'https://ko-fi.com/thelindat',
      },
      {
        name: 'Dunak',
        value: 'https://ko-fi.com/dunak',
      },
      {
        name: 'Luke',
        value: 'https://ko-fi.com/lukewastaken',
      },
      {
        name: 'DokaDoka',
        value: 'https://ko-fi.com/dokadoka',
      }
    );

  return embed;
}

export default Ox;
