import { GuildMember, PartialGuildMember, TextChannel } from 'discord.js';
import { member_activity_channel } from '../settings.json';

export const onMemberLeave = async (member: GuildMember | PartialGuildMember) => {
  if (member.partial) {
    console.log('Member data is partial. Some information might be missing.');
    return;
  }
  const channel = member.guild.channels.cache.get(member_activity_channel) as TextChannel;
  if (!channel) return;

  const joinDate = member.joinedAt;
  const leaveDate = new Date();
  if (!joinDate) {
    channel.send(`<@${member.id}> has left the server. Join date not available.`);
    return;
  }

  const duration = leaveDate.getTime() - joinDate.getTime();
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

  const durationMessage =
    days > 0
      ? `${days} days, ${hours} hours, and ${minutes} minutes`
      : hours > 0
        ? `${hours} hours and ${minutes} minutes`
        : `${minutes} minutes`;

  const farewellMessage = `<@${member.id}> has left the server. They were here for ${durationMessage}.`;
  channel.send(farewellMessage);
};
