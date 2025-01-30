import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/command';
import { GithubUrl, ResourceChoices } from '../../constants';

const Issue: Command = {
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
  async run(interaction: ChatInputCommandInteraction) {
    const repo = interaction.options.getString('repository', true);
    if (!repo) {
      await interaction.reply({ content: 'Invalid repository selected.', ephemeral: true });
      return;
    }
    const link = `${GithubUrl}/${repo}/issues/new/choose`;
    await interaction.reply(`Submit Issue for **${repo}**: <${link}>`);
  },
};

export default Issue;
