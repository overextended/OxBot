import { Message, MessageEmbedOptions, PartialMessage, TextChannel } from 'discord.js';
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

  const fields = [{ name: 'Message', value: message.content || '**NO MESSAGE SENT**' }];

  let i = 0;
  message.attachments.forEach((attachment) => {
    if (i < 24) {
      fields.push({
        name: attachment.name || '**NO ATTACHEMENT NAME FOUND**',
        value: attachment.attachment as string,
      });
    }
    i++;
  });

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

  let logChannel: TextChannel;
  try {
    logChannel = (await Bot.channels.fetch(log_channel)) as TextChannel;
  } catch (error) {
    console.error('Error fetching the log channel:', error);
    return;
  }

  if (!logChannel) return;

  try {
    await logChannel.send({ embeds: [messageDeleteEmbed] });
  } catch (error) {
    console.error('Error sending the embed to the log channel:', error);
  }
};
