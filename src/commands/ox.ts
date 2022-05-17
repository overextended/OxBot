import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbedOptions } from 'discord.js';
import { Command } from '../interfaces/command';

const OxEmbed: MessageEmbedOptions = {
  title: 'Overextended',
  color: 'AQUA',
  description:
    'Overextended is a small group working to create open-source resources for FiveM, with focus on security, performance and stability.',
  thumbnail: { url: 'https://i.imgur.com/Rp4xZiU.png' },
  fields: [
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
    },
  ],
};

const Ox: Command = {
  data: new SlashCommandBuilder().setName('ox').setDescription('About Overextended'),
  run: async (interaction) => await interaction.reply({ embeds: [OxEmbed] }),
};

export default Ox;
