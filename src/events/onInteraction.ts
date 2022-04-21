import { Interaction, MessageEmbedOptions, TextChannel } from 'discord.js';
import { CommandList } from '../commands';
import { log_channel } from '../settings.json';

export const onInteraction = async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;
  for (const Command of CommandList) {
    if (interaction.commandName === Command.data.name) {
      if (interaction.commandName === 'mod') {
        const logChannel = interaction.guild?.channels.cache.get(log_channel) as TextChannel;
        logChannel && logChannel.send(`${interaction.user.tag} used **mod**!`);
      }
      await Command.run(interaction);
      break;
    }
  }
};
