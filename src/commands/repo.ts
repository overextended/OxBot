import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteractionOption, MessageEmbed } from 'discord.js';
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
    await newEmbed(channel, interaction.options.getString('name', true));
  },
};

const newEmbed = async (channel: any, repository: string) => {
  console.log(repository);
  const response = await fetch(`https://api.github.com/repos/overextended/${repository}`);
  const data = await response.json();
  const repoEmbed = new MessageEmbed()
    .setColor('#2696e0')
    .setTitle(data.name)
    .setDescription(data.description)
    .setThumbnail('https://i.imgur.com/Rp4xZiU.png')
    .addFields(
      { name: 'Watchers', value: data.subscribers_count.toString(), inline: true },
      { name: 'Forks', value: data.forks.toString(), inline: true },
      { name: 'Stars', value: data.stargazers_count.toString(), inline: true }
    )
    .setURL(`https://github.com/overextended/${repository}`);
  //   console.log(data);
  return channel.send({ embeds: [repoEmbed] });
};

export default Repo;
