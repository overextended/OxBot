import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../../interfaces/command';
import commands from '../../handlers/commandHandler';

const Help: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all available commands'),

  async run(interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('Available Commands')
      .setColor(0x00AE86)
      .setDescription('Here are all the commands you can use:');

    commands.forEach((command) => {
      embed.addFields({ name: `/${command.data.name}`, value: command.data.description });
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export default Help;
