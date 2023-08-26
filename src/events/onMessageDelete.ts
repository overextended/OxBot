import { Message, EmbedBuilder, PartialMessage, TextChannel, AuditLogEvent, Attachment } from 'discord.js';
import { Bot } from '..';
import { log_channel } from '../settings.json';

export const onMessageDelete = async (message: Message | PartialMessage) => {
  if (message.partial) {
    try {
      await message.fetch();
    } catch (error) {
      console.error('Error fetching the message:', error);
      return;
    }
  }

  if (!message.guild) return;

  const content = message.content || '**NO MESSAGE SENT**';
  const authorId = message.author?.id || 'Unknown ID';
  const messageId = message.id || 'Unknown ID';

  const fetchedLogs = await message.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MessageDelete,
  });

  const deletionLog = fetchedLogs.entries.first();
  let deleterId;
  if (deletionLog) {
    const { executor } = deletionLog;
    deleterId = executor?.id;
  }

  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setTitle('Message Deleted')
    .setDescription(`Message sent by <@${authorId}> in ${message.channel.toString()} was deleted by <@${deleterId}>.`)
    .addFields({ name: 'Message Content', value: `${content}\n\n` })
    .setFooter({ text: `Author ID: ${authorId} | Message ID: ${messageId}` })
    .setTimestamp(message.createdTimestamp)
    .setAuthor({
      name: message.author?.username || 'Unknown Username',
      iconURL: message.author?.displayAvatarURL() || undefined,
    });

  let i = 0;
  message.attachments.forEach((attachment: Attachment) => {
    if (i < 24) {
      embed.addFields({ name: `Attachment ${i + 1}`, value: attachment.url });
      i++;
    }
  });

  const logChannel = Bot.channels.cache.get(log_channel) as TextChannel;
  if (logChannel) {
    logChannel.send({ embeds: [embed] });
  }
};
