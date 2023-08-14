import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbedOptions } from 'discord.js';
import { Command } from '../interfaces/command';
import { DocsUrl, ResourceChoices } from '../constants';

const Docs: Command = {
  data: new SlashCommandBuilder()
    .setName('docs')
    .setDescription('Get a documentation link for an Overextended resource.')
    .addStringOption((option) =>
      option
        .setName('resource')
        .setDescription('Resource to get the documentation for.')
        .setRequired(true)
        .addChoices(...ResourceChoices)
    ),
  run: async (interaction) => {
    const resource = interaction.options.getString('resource');
    const docsEmbed: MessageEmbedOptions = {
      title: 'Documentation',
      description: 'Please read the documentation thoroughly and carefully.',
      color: 'GREEN',
      fields: [
        {
          name: resource || 'Website',
          value: `${DocsUrl}/${resource}`,
        },
      ],
    };
    return await interaction.reply({ embeds: [docsEmbed] });
  },
};

export default Docs;
