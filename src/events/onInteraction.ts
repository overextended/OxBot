import { Interaction, TextChannel } from 'discord.js';
import { CommandList } from '../commands';
import { log_channel } from '../settings.json';

export const onInteraction = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  for (const Command of CommandList) {
    if (interaction.commandName === Command.data.name) {
      if (interaction.commandName === 'mod' || interaction.commandName === 'bulkunban') {
        const logChannel = interaction.guild?.channels.cache.get(log_channel) as TextChannel;
        logChannel && logChannel.send(`${interaction.user.tag} used **${interaction.commandName}**!`);
      }

      if (typeof Command.run === 'function') {
        await Command.run(interaction);
      }

      break;
    }
  }
};
