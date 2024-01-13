import { GuildMember, TextChannel } from 'discord.js';
import { member_activity_channel } from '../settings.json';

export const onMemberJoin = async (member: GuildMember) => {
  const channel = member.guild.channels.cache.get(member_activity_channel) as TextChannel;
  if (!channel) return;

  const welcomeMessage = `Welcome <@${member.id}> to the server!`;
  channel.send(welcomeMessage);
};
