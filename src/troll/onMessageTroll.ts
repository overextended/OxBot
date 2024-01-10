import { Message } from 'discord.js';
import { customTrollResponses } from './trollResponses';

const cooldowns = new Map();

export const onMessageTroll = async (message: Message) => {
  if (message.author.bot) {
    return;
  }

  const userId = message.author.id;

  const responseProbability = 0.01; // 1% chance to respond
  const cooldownPeriod = 30 * 60 * 1000; // 30 minutes

  if (cooldowns.has(userId)) {
    const lastResponseTime = cooldowns.get(userId);
    if (Date.now() - lastResponseTime < cooldownPeriod) {
      return; 
    }
  }

  const responses = customTrollResponses.get(userId);
  if (responses && Math.random() < responseProbability) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    const randomTrollMessage = responses[randomIndex];
    await message.reply(randomTrollMessage);

    cooldowns.set(userId, Date.now());
  }
};
