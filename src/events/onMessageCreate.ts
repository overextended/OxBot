import { Message } from 'discord.js';
import { ignoredRoles, whitelistedChannels } from '../constants';
import { positivePatterns, negativePatterns, resourcePatterns } from '../utils/patterns';
import { guidelineResponses, resourceResponses, cooldownResponses } from '../utils/responses';

const userResponseCooldown = new Map<string, { count: number; lastResponseTime: number }>();

export const onMessageCreate = async (message: Message) => {
  // Initial checks
  if (message.author.bot || whitelistedChannels.includes(message.channelId)) return;
  const member = message.member;
  if (!member || member.roles.cache.some((role) => ignoredRoles.includes(role.id))) return;

  const lowerCaseMessage = message.content.toLowerCase();
  const userId = message.author.id;
  const now = Date.now();
  const cooldownPeriod = 15 * 60 * 1000;

  // Cooldown logic
  if (userResponseCooldown.has(userId)) {
    const userData = userResponseCooldown.get(userId);
    if (userData && now - userData.lastResponseTime < cooldownPeriod) {
      if (userData.count >= 3) {
        return; // User is in cooldown, do not respond
      }
    } else {
      // Reset count if cooldown has expired
      userResponseCooldown.set(userId, { count: 0, lastResponseTime: now });
    }
  } else {
    userResponseCooldown.set(userId, { count: 0, lastResponseTime: now });
  }

  // Negative pattern check
  const isNegativeMatch = negativePatterns.some(pattern => pattern.test(lowerCaseMessage));
  if (isNegativeMatch) return; // Stop processing if a negative pattern is matched

  // Matching patterns
  const isResourceMatch = resourcePatterns.some(pattern => pattern.test(lowerCaseMessage));
  const isPositiveMatch = positivePatterns.some(pattern => pattern.test(lowerCaseMessage));

  // Send replies and update cooldown
  const sendReplyAndUpdateCooldown = async (response: string) => {
    await message.reply(response);

    const userData = userResponseCooldown.get(userId);
    if (userData) {
      userData.count++;
      userData.lastResponseTime = now;

      if (userData.count === 3) {
        const randomIndex = Math.floor(Math.random() * cooldownResponses.length);
        const randomCooldownMessage = cooldownResponses[randomIndex];
        await message.reply(randomCooldownMessage);
      }
    }
  };

  // Respond based on matches
  if (isResourceMatch) {
    const randomResourceResponse = resourceResponses[Math.floor(Math.random() * resourceResponses.length)];
    await sendReplyAndUpdateCooldown(randomResourceResponse);
  }

  if (isPositiveMatch && message.channelId in guidelineResponses) {
    const responseMessages = guidelineResponses[message.channelId];
    if (responseMessages) {
      const randomResponse = responseMessages[Math.floor(Math.random() * responseMessages.length)];
      await sendReplyAndUpdateCooldown(randomResponse);
    }
  }
};
