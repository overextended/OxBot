import { Message, MessageEmbed, PartialMessage, TextChannel } from 'discord.js';
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

    const authorTag = message.author?.tag || 'Unknown Author';
    const content = message.content || '**NO MESSAGE SENT**';
    const authorId = message.author?.id || 'Unknown ID';
    const messageId = message.id || 'Unknown ID';
    
    const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Message Deleted')
        .setDescription(`Message sent by <@${authorId}> in ${message.channel.toString()} was deleted.`)
        .addField('Message Content', `${content}\n\n`)
        .setFooter({ text: `Author ID: ${authorId} | Message ID: ${messageId}` })
        .setTimestamp(message.createdTimestamp)
        .setAuthor({
            name: message.author?.username || 'Unknown Username',
            iconURL: message.author?.displayAvatarURL() || undefined
        });
    
    let i = 0;
    message.attachments.forEach((attachment) => {
        if (i < 24) {
            embed.addField(`Attachment ${i+1}`, attachment.url);
            i++;
        }
    });
    
    const logChannel = Bot.channels.cache.get(log_channel) as TextChannel;
    if (logChannel) {
        logChannel.send({ embeds: [embed] });
    }
};
