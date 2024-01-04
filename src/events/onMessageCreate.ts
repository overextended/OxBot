import { Message } from 'discord.js';
import { ignoredRoles, whitelistedChannels, guidelines } from '../constants';
import { patterns } from '../utils/patterns';

interface ChannelResponses {
  [key: string]: string[];
}

const generalResponseMessages = [`For Support Read: ${guidelines}`];

const channelSpecificResponses: ChannelResponses = {
  // General Channel
  '813030955598086177': [
    `Read the channel description, dip shit.`,
    `Does this look like the support channel? Read ${guidelines}.`,
    `For Support Read: ${guidelines}`,
    `I wonder what this is for? ${guidelines}`,
    `For fucks sake, read ${guidelines}`,
    `Have you had a chance to review our ${guidelines} channel?`,
  ],
};

export const onMessageCreate = async (message: Message) => {
  if (message.author.bot) {
    return;
  }

  if (whitelistedChannels.includes(message.channelId)) {
    return;
  }

  const member = message.member;
  if (!member) {
    return;
  }

  const hasIgnoredRole = member.roles.cache.some((role) => ignoredRoles.includes(role.id));

  if (!hasIgnoredRole) {
    const lowerCaseMessage = message.content.toLowerCase();

    const isMatch = patterns.some((pattern) => pattern.test(lowerCaseMessage));

    if (isMatch) {
      let responseMessages;
      if (channelSpecificResponses[message.channelId]) {
        responseMessages = channelSpecificResponses[message.channelId];
      } else {
        responseMessages = generalResponseMessages;
      }

      const randomResponse = responseMessages[Math.floor(Math.random() * responseMessages.length)];
      await message.reply(randomResponse);
    }
  }
};
