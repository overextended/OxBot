import { Message } from 'discord.js';

const ignoredRoles = [
  '814181424840179733', // Admin
  '819891382114189332', // Shrimp Supreme
  '933681479878324234', // Dictator
  '892853647950618675', // Overextended
  '831961060314972170', // Senior Moderator
  '945991885783175189', // Moderator
  '906292806098759750', // Contributor
  '1120932120056057926', // Affiliate
  '816709868764921876', // Coffee Drinker
  '842456416019021895', // Recognized Member
  '1140367518230397029', // GitHub
];
const patterns = [
  /why\s+can'?t\s+i\s+(not\s+)?(type|post)\s+in\s+support\??/i,
  /how\s+can\s+i\s+get\s+verified\s+(to\s+)?(type|post)\s+in\s+support/i,
  /can'?t\s+(type|post)\s+in\s+support/i,
  /help\s+(with\s+)?(typing|posting)\s+in\s+support/i,
  /help/i,
  /cant\s+type/i,
  /can'?t\s+type/i,
  /need\s+support/i,
  /support\s+needed/i,
  /how\s+can\s+i/i,
  /\bsupport\b/i,
];

const guidelines = '<#1114827068337815612>';

interface ChannelResponses {
  [key: string]: string[];
}

const generalResponseMessages = [`For Support Read: ${guidelines}`];

const channelSpecificResponses: ChannelResponses = {
  // Scripting Channel
  '869564691637231676': [
    `This channel is for general scripting, ${guidelines}.`,
    `There is a support channel, maybe you should read ${guidelines}.`,
  ],
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
