import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/command';
import { GithubApi, GithubUrl, ResourceChoices } from '../../constants';
import axios from 'axios';
import logger from '../../utils/logger';

const Repo: Command = {
  data: new SlashCommandBuilder()
    .setName('repo')
    .setDescription('Fetch Overextended repository')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Name of an Overextended repository.')
        .setRequired(true)
        .addChoices(...ResourceChoices)
    ),
  async run(interaction: CommandInteraction) {
    const repositoryName = interaction.options.get('name')?.value as string;
    await newEmbed(interaction, repositoryName);
  },
};

const newEmbed = async (interaction: CommandInteraction, repository: string) => {
  try {
    const response = await axios.get(`${GithubApi}/${repository}`);

    const data = response.data;

    const repoEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(data.name)
      .setDescription(data.description)
      .setThumbnail('https://i.imgur.com/Rp4xZiU.png')
      .addFields(
        { name: 'Watchers', value: data.subscribers_count.toString(), inline: true },
        { name: 'Forks', value: data.forks.toString(), inline: true },
        { name: 'Stars', value: data.stargazers_count.toString(), inline: true }
      )
      .setURL(`${GithubUrl}/${repository}`);

    return interaction.reply({ embeds: [repoEmbed] });
  } catch (error) {
    logger.error('Error fetching repository data:', error);
    return interaction.reply('An error occurred while fetching repository data.');
  }
};

export default Repo;
