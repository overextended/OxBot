import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbedOptions } from 'discord.js';
import { Command } from '../interfaces/command';

const Docs: Command = {
  data: new SlashCommandBuilder()
    .setName('docs')
    .setDescription('Get a documentation link for an Overextended resource.')
    .addStringOption((option) =>
      option
        .setName('resource')
        .setDescription('Resource to get the documentation for.')
        .setRequired(true)
        .addChoices(
          { name: 'ox_lib', value: 'ox_lib' },
          { name: 'ox_inventory', value: 'ox_inventory' },
          { name: 'oxmysql', value: 'oxmysql' },
          { name: 'ox_core', value: 'ox_core' },
          { name: 'ox_target', value: 'ox_target' }
        )
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
          value: `https://overextended.github.io/docs/${resource}`,
        },
      ],
    };
    return await interaction.reply({ embeds: [docsEmbed] });
  },
};

export default Docs;
