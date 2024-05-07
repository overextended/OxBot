import { User, Guild, TextChannel, EmbedBuilder } from 'discord.js';
import { log_channel } from '../settings.json';
import logger from '../utils/logger';

export async function handleMemberWarn(
  warnedUser: User,
  issuer: User,
  reason: string,
  warnCount: number,
  timeoutDuration: number | null,
  guild: Guild,
  warnId: number
) {
  try {
    const warnEmbed = new EmbedBuilder()
      .setColor('#FFFF00')
      .setTitle('Member Warned')
      .setDescription(`<@${warnedUser.id}> has been **warned** by <@${issuer.id}>.\n\n Warn ID: ${warnId}`)
      .addFields(
        { name: 'Reason', value: reason },
        { name: 'Total Warnings', value: warnCount.toString(), inline: true }
      )
      .setAuthor({
        name: warnedUser.username || 'Unknown Username',
        iconURL: warnedUser.displayAvatarURL(),
      })
      .setTimestamp(new Date())
      .setFooter({ text: `Member ID: ${warnedUser.id}` });

    if (timeoutDuration !== null) {
      const durationText = `${timeoutDuration / 60000} minutes`;
      warnEmbed.addFields({ name: 'Timeout Duration', value: durationText, inline: true });
    }

    const channel = guild.channels.cache.get(log_channel) as TextChannel;
    if (!channel) {
      throw new Error(`Channel with ID ${log_channel} not found`);
    }

    await channel.send({ embeds: [warnEmbed] });
  } catch (error) {
    logger.error('Failed to log warning:', error);
  }
}
