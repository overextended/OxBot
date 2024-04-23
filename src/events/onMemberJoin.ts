import { GuildMember, TextChannel } from 'discord.js';
import { member_activity_channel } from '../settings.json';

export const onMemberJoin = async (member: GuildMember) => {
  const channel = member.guild.channels.cache.get(member_activity_channel) as TextChannel;
  if (!channel) return;

  const welcomeMessage = `Welcome <@${member.id}> to the server!`;
  channel.send(welcomeMessage);

  const roleId = '842455998266605610'; // Overextended Member RoleID
  const role = member.guild.roles.cache.get(roleId);

  if (!role) {
    console.error(`Role not found: ${roleId}`);
    return;
  }

  try {
    await member.roles.add(role);
    console.log(`Assigned role '${role.name}' to ${member.displayName}`);
  } catch (error) {
    console.error(`Could not assign role to ${member.displayName}: ${error}`);
  }
};
