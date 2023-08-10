import { Message, MessageEmbedOptions, PartialMessage, TextChannel } from 'discord.js';
import { Bot } from '..';
import { log_channel } from '../settings.json';

export const onMessageDelete = async (message: Message<boolean> | PartialMessage) => {
  const fields = [{ name: 'Message', value: message.content || '**NO MESSAGE SENT**' }];
  message.attachments.map((attachement) =>
    fields.push({ name: attachement.name || '**NO ATTACHEMENT NAME FOUND**', value: attachement.attachment as string })
  );

  const messageDeleteEmbed: MessageEmbedOptions = {
    title: 'Message removed',
    description: `<@${message.author?.id}> removed a message in <#${message.channel.id}>`,
    author: {
      name: message.author?.username,
      iconURL: message.author?.displayAvatarURL(),
    },
    color: 'RED',
    fields,
  };

  const logChannel = (await Bot.channels.fetch(log_channel)) as TextChannel;

  if (!logChannel) return;

  await logChannel.send({ embeds: [messageDeleteEmbed] });
};
