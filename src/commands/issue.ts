import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../interfaces/command';
import { GithubUrl, ResourceChoices } from '../constants';

const issue: Command = {
  data: new SlashCommandBuilder()
    .setName('issue')
    .setDescription('Get the issue link for a specific repository.')
    .addStringOption((option) =>
      option
        .setName('repository')
        .setDescription('Select the repository')
        .setRequired(true)
        .addChoices(...ResourceChoices)
    ),
  run: async (interaction: CommandInteraction) => {
    const repo = interaction.options.getString('repository');
    const link = `${GithubUrl}/${repo}/issues` || 'Unknown repository';
    await interaction.reply(`Issue link for ${repo}: ${link}`);
  },
};

export default issue;
