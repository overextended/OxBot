import { Message } from 'discord.js';
import { customTrollResponses } from './trollResponses';

export const onMessageTroll = async (message: Message) => {
  if (message.author.bot) {
    return;
  }

  const userId = message.author.id;

  const responseProbability = 0.05; // 5% chance to respond

  const responses = customTrollResponses.get(userId);
  if (responses && Math.random() < responseProbability) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    const randomTrollMessage = responses[randomIndex];
    await message.reply(randomTrollMessage);
  }
};
