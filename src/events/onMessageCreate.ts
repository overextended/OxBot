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
  /(\bhelp\b|\bhlep\b|\bhalp\b)/i, // help, hlep, halp
  /(\bsupport\b|\bsuport\b)/i, // support, suport
  /(\bhow\s+can\b)/i, // how can
  /(\bcant\b|\bcan't\b)/i, // cant, can't
  /(\btype\b)/i, // type
  /(\bpost\b)/i, // post
  /(\bhow\b)/i, // how
  /(\bsomehow\b)/i, // somehow
  /(\bis\s+there\b)/i, // is there
  /(\bcan\b)/i, // can
  /(\bpossible\b)/i, // possible
  /(\berror\b)/i, // error
  /(\bwont\b)/i, // wont
  /(\bconnect\b)/i, // connect
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

const whitelistedChannelIds = [
  '829915571394052176', // coffee-club
  '906294817678590012', // nerd-club
  `844240881283366962`, // shitposting
];

export const onMessageCreate = async (message: Message) => {
  if (message.author.bot) {
    return;
  }

  if (whitelistedChannelIds.includes(message.channelId)) {
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
