import { GuildBan, MessageEmbedOptions, TextChannel } from 'discord.js';
import { log_channel } from '../settings.json';

export const onMemberBan = async (ban: GuildBan) => {
  const logs = await ban.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_BAN_ADD' });
  const log = logs.entries.first();
  if (!log) return console.log('No audit log for the banned user found.');
  const banEmbed: MessageEmbedOptions = {
    title: 'Member banned',
    description: `<@${ban.user.id}> has been banned by <@${log.executor?.id}>`,
    author: {
      name: log.executor?.tag,
      iconURL: log.executor?.displayAvatarURL(),
    },
    color: 'RED',
    thumbnail: { url: ban.user.displayAvatarURL() },
  };
  const channel = ban.guild.channels.cache.get(log_channel) as TextChannel;
  channel && channel.send({ embeds: [banEmbed] });
};
