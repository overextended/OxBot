import { Interaction, TextChannel } from 'discord.js';
import commands from '../handlers/commandHandler';
import Config from '../config';
import logger from '../utils/logger';

export const onInteraction = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  if (interaction.commandName === 'kick' || interaction.commandName === 'bulkunban') {
    const logChannel = interaction.guild?.channels.cache.get(Config.LOG_CHANNEL) as TextChannel;
    logChannel && logChannel.send(`${interaction.user.tag} used **${interaction.commandName}**!`);
  }

  if (typeof command.run === 'function') {
    try {
      await command.run(interaction);
    } catch (error) {
      logger.error(`Error executing command ${interaction.commandName}:`, error);
      await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
    }
  }
};
