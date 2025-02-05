import {
  ReadonlyCollection,
  Message,
  EmbedBuilder,
  TextChannel,
  GuildTextBasedChannel,
  PartialMessage,
} from 'discord.js';
import { Bot } from '..';
import Config from '../config';
import logger from '../utils/logger';

export const onMessageDeleteBulk = async (
  messages: ReadonlyCollection<string, Message<boolean> | PartialMessage>,
  channel: GuildTextBasedChannel
) => {
  if (!messages.first()?.guild) return;

  if (!(channel instanceof TextChannel)) return;

  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setTitle(`Bulk Message Deletion in #${channel.name}`)
    .setDescription(`**${messages.size} messages were deleted in ${channel.toString()}**`)
    .setTimestamp()
    .setFooter({ text: `Channel ID: ${channel.id}` });

  const logChannel = Bot.channels.cache.get(Config.LOG_CHANNEL) as TextChannel;
  if (logChannel) {
    try {
      logChannel.send({ embeds: [embed] });
    } catch (error) {
      logger.error('Error sending bulk deletion log:', error);
    }
  }
};
