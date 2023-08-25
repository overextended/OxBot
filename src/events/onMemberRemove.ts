import { GuildMember, EmbedBuilder, PartialGuildMember, TextChannel, AuditLogEvent } from 'discord.js';
import { Bot } from '..';
import { log_channel } from '../settings.json';

export const onMemberRemove = async (member: GuildMember | PartialGuildMember) => {
  if (member.partial) {
    try {
      await member.fetch();
    } catch (error) {
      console.error('Error fetching the member:', error);
      return;
    }
  }

  if (!member.guild) return;

  const logs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberKick });
  const log = logs.entries.first();
  if (!log) return console.log('No audit log for kicked member found.');
  if (member.joinedTimestamp && log.createdTimestamp < member.joinedTimestamp) return;
  if (log.executor?.id === '874059310869655662') return; // Check for Warden

  const kickedMemberId = member.id;
  const kickerId = log.executor?.id;

  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setTitle('Member Kicked')
    .setDescription(`<@${kickedMemberId}> was kicked by <@${kickerId}>.`)
    .addFields({ name: 'Reason', value: log.reason || 'No reason provided.' })
    .setFooter({ text: `Member ID: ${kickedMemberId}` })
    .setTimestamp(log.createdTimestamp)
    .setAuthor({
      name: member.user?.username || 'Unknown Username',
      iconURL: member.user?.displayAvatarURL() || undefined,
    });

  const logChannel = Bot.channels.cache.get(log_channel) as TextChannel;
  if (logChannel) {
    logChannel.send({ embeds: [embed] });
  }
};
