import { Message, MessageEmbedOptions, PartialMessage, EmbedFieldData, TextChannel } from 'discord.js';
import { log_channel } from '../settings.json';

export const onMessageDelete = async (message: Message<boolean> | PartialMessage) => {
  if (!message.guild) return;
  const logs = await message.guild.fetchAuditLogs({ limit: 1, type: 'MESSAGE_DELETE' });
  const log = logs.entries.first();
  if (!log) return console.log('No audit log for deleted message found.');
  const fields: EmbedFieldData[] = [{ name: 'Message content', value: message.content || '' }];
  if (message.attachments) {
    message.attachments.map((attachment) => {
      attachment.name &&
        attachment.proxyURL &&
        fields.push({ name: attachment.name, value: `[Image](${attachment.proxyURL})` });
    });
  }

  const embed: MessageEmbedOptions = {
    title: 'Message deleted',
    description: `Message from <@${message.author?.id}> deleted by <@${log.executor?.id}> in <#${message.channelId}>`,
    color: 'RED',
    thumbnail: { url: log.executor?.displayAvatarURL() },
    fields: fields,
  };

  const channel = message.guild.channels.cache.get(log_channel) as TextChannel;
  channel ? channel.send({ embeds: [embed] }) : message.channel.send('No specified log channel found.');
};
