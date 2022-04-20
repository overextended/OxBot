import { GuildMember, MessageEmbedOptions, PartialGuildMember, TextChannel } from 'discord.js';
import { log_channel } from '../settings.json';

export const onMemberRemove = async (member: GuildMember | PartialGuildMember) => {
  const logs = await member.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_KICK' });
  const log = logs.entries.first();
  if (!log) return console.log('No audit log for kicked member found.');
  if (member.joinedAt && log.createdAt < member.joinedAt) return;
  if (log.executor?.id === '874059310869655662') return; // Check for Warden

  const kickEmbed: MessageEmbedOptions = {
    title: 'Member kicked',
    description: `<@${member.id}> has been **kicked** by <@${log.executor?.id}>`,
    author: {
      name: log.executor?.tag,
      iconURL: log.executor?.displayAvatarURL(),
    },
    color: 'AQUA',
    thumbnail: { url: member.displayAvatarURL() },
  };

  const channel = member.guild.channels.cache.get(log_channel) as TextChannel;
  channel && channel.send({ embeds: [kickEmbed] });
};
