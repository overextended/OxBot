import { AuditLogEvent, GuildBan, EmbedBuilder, TextChannel, Guild, User } from 'discord.js';
import { log_channel } from '../settings.json';

export const onMemberBan = async (ban: GuildBan) => {
  const logs = await ban.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanAdd });
  const log = logs.entries.first();

  if (!log || !log.executor) {
    return console.log('No audit log for the banned user found or executor is missing.');
  }

  if (log.executor.id === '874059310869655662') return; // Check for Warden

  const banEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle('Member Banned')
    .setDescription(`<@${ban.user.id}> has been **banned** by <@${log.executor.id}>.`)
    .addFields({ name: 'Reason', value: log.reason || 'No reason provided.' })
    .setAuthor({
      name: ban.user.username || 'Unknown Username',
      iconURL: ban.user.displayAvatarURL(),
    })
    .setTimestamp(log.createdTimestamp)
    .setFooter({ text: `Member ID: ${ban.user.id}` })
    .setThumbnail(ban.user.displayAvatarURL());

  const channel = ban.guild.channels.cache.get(log_channel) as TextChannel;
  channel && channel.send({ embeds: [banEmbed] });
};
