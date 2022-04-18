import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbedOptions } from 'discord.js';
import { Command } from '../interfaces/command';
import fetch from 'node-fetch';

const Repo: Command = {
  data: new SlashCommandBuilder()
    .setName('repo')
    .setDescription('Fetch Overextended repository')
    .addStringOption((option) =>
      option.setName('name').setDescription('Name of an Overextended repository.').setRequired(true)
    ),
  run: async (interaction) => {
    const { channel } = interaction;
    if (!channel) return;
    return newEmbed(interaction, interaction.options.getString('name', true));
  },
};

const newEmbed = async (interaction: CommandInteraction, repository: string) => {
  const response = await fetch(`https://api.github.com/repos/overextended/${repository}`);
  if (response.status !== 200) return interaction.reply('No such Overextended repository found.');
  const data = await response.json();
  const repoEmbed: MessageEmbedOptions = {
    color: '#2696e0',
    title: data.name,
    description: data.description,
    thumbnail: { url: 'https://i.imgur.com/Rp4xZiU.png' },
    fields: [
      { name: 'Watchers', value: data.subscribers_count.toString(), inline: true },
      { name: 'Forks', value: data.forks.toString(), inline: true },
      { name: 'Stars', value: data.stargazers_count.toString(), inline: true },
    ],
    url: `https://github.com/overextended/${repository}`,
  };
  return interaction.reply({ embeds: [repoEmbed] });
};

export default Repo;
