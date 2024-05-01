import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/command';
import axios from 'axios';

const Native: Command = {
  data: new SlashCommandBuilder()
    .setName('native')
    .setDescription('Get information on a specific GTA V native function.')
    .addStringOption((option) =>
      option.setName('namespace').setDescription('The namespace of the native').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('function').setDescription('The native function name').setRequired(true)
    ),
  async run(interaction: CommandInteraction) {
    const namespaceOption = interaction.options.get('namespace', true);
    const functionNameOption = interaction.options.get('function', true);
    const namespace = namespaceOption.value as string;
    const functionName = functionNameOption.value as string;

    await fetchNativeAndSendEmbed(interaction, namespace, functionName);
  },
};

async function fetchNativeAndSendEmbed(interaction: CommandInteraction, namespace: string, functionName: string) {
  try {
    const fileContent = await fetchNativeFromGitHub(namespace, functionName);

    const embed = new EmbedBuilder()
      .setTitle(`${functionName} - Native Function`)
      .setDescription(fileContent)
      .setColor('#0099FF');

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Failed to fetch native function data:', error);
    await interaction.reply({ content: 'An error occurred while fetching the native function data.', ephemeral: true });
  }
}

async function fetchNativeFromGitHub(namespace: string, functionName: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/citizenfx/natives/master/${namespace}/${functionName}.md`;
  const response = await axios.get(url);
  return response.data;
}

export default Native;