import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
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
  async execute(interaction: CommandInteraction) {
    const resourceOption = interaction.options.get('resource');
    const resource = resourceOption?.value as string;
    await sendDocumentationEmbed(interaction, resource);
  },
};

const sendDocumentationEmbed = async (interaction: CommandInteraction, resource: string) => {
  const docsEmbed = new EmbedBuilder()
    .setTitle('Documentation')
    .setDescription('Please read the documentation thoroughly and carefully.')
    .setColor(0x26e0a5)
    .addFields({
      name: resource || 'Website',
      value: `${DocsUrl}/${resource}`,
    });

  await interaction.reply({ embeds: [docsEmbed] });
};

export default Docs;
