import { AuditLogEvent, GuildBan, EmbedBuilder, TextChannel } from 'discord.js';
import { log_channel } from '../settings.json';

export const onMemberUnban = async (unban: GuildBan) => {
  const logs = await unban.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanRemove });
  const log = logs.entries.first();

  if (!log || !log.executor) {
    return console.log('No audit log for the unbanned user found or executor is missing.');
  }

  if (log.executor.id === '874059310869655662') return; // Check for Warden

  const unbanEmbed = new EmbedBuilder()
    .setColor(0x00ff00) 
    .setTitle('Member Unbanned')
    .setDescription(`<@${unban.user.id}> has been **unbanned** by <@${log.executor.id}>`)
    .addFields({ name: 'Reason', value: log.reason || 'No reason provided.' })
    .setAuthor({
      name: unban.user.username || 'Unknown Username',
      iconURL: unban.user.displayAvatarURL(),
    })
    .setTimestamp(log.createdTimestamp)
    .setFooter({ text: `Member ID: ${unban.user.id}` })
    .setThumbnail(unban.user.displayAvatarURL());

  const channel = unban.guild.channels.cache.get(log_channel) as TextChannel;
  channel && channel.send({ embeds: [unbanEmbed] });
};
