import { Interaction, EmbedBuilder, TextChannel } from 'discord.js';
import { log_channel } from '../settings.json';

const commandWhitelist = new Set(['docs', 'issue', 'ox', 'ping', 'repo', 'guild', 'whois']);

function getChannelMention(channel: TextChannel | null) {
  return channel ? `<#${channel.id}>` : 'Unknown Channel';
}

export async function onSlashCommand(interaction: Interaction) {
  if (!interaction.isCommand() || !interaction.guild) return;

  if (!commandWhitelist.has(interaction.commandName)) {
    const channelMention = getChannelMention(interaction.channel as TextChannel);

    try {
      const logEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Slash Command Used')
        .setDescription(`User <@${interaction.user.id}> used \`/${interaction.commandName}\` in ${channelMention}.`)
        .setTimestamp()
        .setFooter({ text: `User ID: ${interaction.user.id}` });

      const logChannel = (await interaction.guild.channels.fetch(log_channel).catch(console.error)) as TextChannel;
      if (logChannel) {
        await logChannel.send({ embeds: [logEmbed] });
      } else {
        console.error(`Log channel with ID ${log_channel} not found`);
      }
    } catch (error) {
      console.error('Failed to log slash command usage:', error);
    }
  }
}
