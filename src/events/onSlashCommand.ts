import { Interaction, EmbedBuilder, TextChannel } from 'discord.js';
import { log_channel } from '../settings.json';

const commandWhitelist = ['docs', 'issue', 'ox', 'ping', 'repo', 'guild', 'whois'];

export async function onSlashCommand(interaction: Interaction) {
  if (!interaction.isCommand()) return;

  if (commandWhitelist.includes(interaction.commandName)) {
    return;
  }

  const channelName = interaction.channel?.toString() || 'Unknown Channel';

  try {
    const logEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Slash Command Used')
      .setDescription(`User <@${interaction.user.id}> used \`/${interaction.commandName}\` in ${channelName}.`)
      .setTimestamp(new Date())
      .setFooter({ text: `User ID: ${interaction.user.id}` });

    const logChannel = interaction.guild?.channels.cache.get(log_channel) as TextChannel;
    if (logChannel) {
      await logChannel.send({ embeds: [logEmbed] });
    } else {
      console.error(`Log channel with ID ${log_channel} not found`);
    }
  } catch (error) {
    console.error('Failed to log slash command usage:', error);
  }
}
