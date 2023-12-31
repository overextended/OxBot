import { Message } from 'discord.js';

const ignoredRoles = [
  '814181424840179733', // Admin
  '819891382114189332', // Shrimp Supreme
  '892853647950618675', // Overextended
  '831961060314972170', // Senior Moderator
  '945991885783175189', // Moderator
  '1140367518230397029', // GitHub
];
const patterns = [
  /(\bwhy\s+can'?t\s+i\s+(not\s+)?(type|post)\s+in\s+support\??\b)|(\bwhy\s+can'?t\s+i\b)|(\btype|post\b)|(\bsupport\b)/i,
  /(\bhow\s+can\s+i\s+get\s+verified\s+(to\s+)?(type|post)\s+in\s+support\b)|(\bhow\s+can\s+i\b)|(\bget\s+verified\b)|(\btype|post\b)|(\bsupport\b)/i,
  /(\bcan'?t\s+(type|post)\s+in\s+support\b)|(\bcan'?t\b)|(\btype|post\b)|(\bsupport\b)/i,
  /(\bhelp\s+(with\s+)?(typing|posting)\s+in\s+support\b)|(\bhelp\b)|(\btyping|posting\b)|(\bsupport\b)/i,
  /(\bhelp\b)/i,
  /(\bcan'?t\s+(type|post)\b)|(\bcan'?t\b)|(\btype|post\b)/i,
  /(\bcant\s+(type|post)\b)|(\bcant\b)|(\btype|post\b)/i,
  /(\bneed\s+support\b)|(\bneed\b)|(\bsupport\b)/i,
  /(\bsupport\s+needed\b)|(\bsupport\b)|(\bneeded\b)/i,
  /(\bhow\s+can\s+i\b)|(\bhow\b)|(\bcan\b)|(\bi\b)/i,
  /(\bsupport\b)/i,
  /(\bcan'?t\s+post\b)|(\bcan'?t\b)|(\bpost\b)/i,
  /(\bunable\s+to\s+post\b)|(\bunable\b)|(\bto\b)|(\bpost\b)/i,
  /(\bnot\s+allowed\s+to\s+post\b)|(\bnot\b)|(\ballowed\b)|(\bto\b)|(\bpost\b)/i,
  /(\bposting\s+issue\b)|(\bposting\b)|(\bissue\b)/i,
  /(\btrouble\s+(with\s+)?(typing|posting)\s+in\s+support\b)|(\btrouble\b)|(\bwith\b)|(\btyping|posting\b)|(\bsupport\b)/i,
  /(\block(ed)?\s+(from\s+)?(typing|posting)\s+in\s+support\b)|(\block(ed)?\b)|(\bfrom\b)|(\btyping|posting\b)|(\bsupport\b)/i,
  /(\baccess\s+issue\s+(with\s+)?support\b)|(\baccess\b)|(\bissue\b)|(\bwith\b)|(\bsupport\b)/i,
  /(\bpermission\s+to\s+(type|post)\s+in\s+support\b)|(\bpermission\b)|(\bto\b)|(\btype|post\b)|(\bsupport\b)/i,
  /(\bhow\s+to\s+(type|post)\s+in\s+support\b)|(\bhow\b)|(\bto\b)|(\btype|post\b)|(\bsupport\b)/i,
  /(\bverify\b)/i,
  /(\bissue\s+(with\s+)?(typing|posting)\s+in\b)|(\bissue\b)|(\bwith\b)|(\btyping|posting\b)|(\bin\b)/i,
  /(\bcan'?t\s+access\s+support\b)|(\bcan'?t\b)|(\baccess\b)|(\bsupport\b)/i,
  /(\bno\s+access\s+to\s+support\b)|(\bno\b)|(\baccess\b)|(\bto\b)|(\bsupport\b)/i,
  /(\bwhy\s+am\s+i\s+(not\s+)?allowed\s+to\s+(type|post)\b)|(\bwhy\b)|(\bam\b)|(\bi\b)|(\bnot\b)|(\ballowed\b)|(\bto\b)|(\btype|post\b)/i,
  /(\bhlep\b)/i, 
  /(\bsuport\b)/i, 
  /(\bhalp\b)/i, 
  /(\bsupport\b)/i, 
];

const guidelines = '<#1114827068337815612>';

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
