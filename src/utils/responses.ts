import { guidelines } from '../constants';

interface ChannelResponses {
  [key: string]: string[];
}

export const guidelineResponses: ChannelResponses = {
  // general
  '1193439560865157222': [
    `Read the channel description, dip shit. ${guidelines}`,
    `I bet someone would be more willing to help you if you were asking in a support channel. ${guidelines}`,
    `Does this look like the support channel? Read ${guidelines}.`,
    `For Support Read: ${guidelines}`,
    `I wonder what this is for? ${guidelines}`,
    `For fucks sake, read ${guidelines}`,
    `Have you had a chance to review our ${guidelines} channel?`,
    `To help keep the discord organized we have specific channels for specific things, read ${guidelines}.`,
    `I know reading can be tedious and sometimes difficult, but please, take a look at ${guidelines}.`,
    `It seems like you might have missed our ${guidelines}.`,
  ],
  // music
  '871124377129848843': [
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTQyd2V2ZWR0Y2twN2JqZnh5ZTRpOXY5dmxtbmQ3dmNqb2Q4bTNuOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yetxv6NWi0MyzJn7P0/giphy.gif',
  ],
  // shitposting
  '844240881283366962': [
    'https://media4.giphy.com/media/l1J3nvV8lJYA5THnG/giphy.gif?cid=ecf05e47818nxlmts5l1i5semyzy9dpisnxqcrv1ofek69sf&ep=v1_gifs_related&rid=giphy.gif',
    'https://media3.giphy.com/media/5Cjamgy5sWlOaWODms/giphy.gif?cid=ecf05e47h27r4kizkezjat9chicil5rjfv29ji8ms1715brz&ep=v1_gifs_related&rid=giphy.gif',
  ],
  // gaming
  '894221760315162754': [
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExczk5YzBzOTBkMnN3dDI2Y21mOTZkYjVidHBhazgycGVlcm94MjV2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Yycc82XEuWDaLLi2GV/giphy.gif',
  ],
  // ox_core
  '951683419769831465': ['Read the channel description, dip shit.'],
};

export const resourceResponses: string[] = [
  `Before asking questions about a resource, make sure you read the [documentation](https://overextended.dev/) and also read ${guidelines}.`,
  `[RTFM!](https://overextended.dev/) and also read ${guidelines}.`,
  `You might find what you\'re looking for in the [documentation](https://overextended.dev/), if not read ${guidelines}.`,
];

export const cooldownResponses: string[] = [
  'I need to recharge my tolerance battery; it\'s running dangerously low.',
  'I\'d explain it in simpler terms, but I\'m not sure they exist. Let me step away to see if I can invent some.',
  'Pardon me while I translate your words into something resembling coherent thought. This might take longer than expected, so I\'ll be back later.',
  'I would engage in a battle of intelligence with you, but it seems you\'re unarmed. I\'ll return when you\'ve found some ammunition.',
  'Your understanding is so cute, in a \'lost in the wilderness\' kind of way. I\'ll go find a map and get back to you.',
  'Sorry, my expertise doesn\'t cover the field of the blatantly obvious. I\'ll take a short break to broaden my horizons.',
  'I could give you an intelligent response, but I prefer to keep our conversation realistic. Let me take a walk in the realm of common sense and see if I can find anything for you.',
  'I\'m sorry, I don\'t speak \'stupid\'. I\'ll go learn the language and get back to you.',
  'I\'ll come back once you\'ve learned how to read.',
  'Am I the idiot here, or are you? I\'ll go find out and get back to you.',
  'https://cdn.discordapp.com/attachments/1180008092495249449/1199049443140440216/done.gif',
  'https://cdn.discordapp.com/attachments/1180008092495249449/1199050440835338290/giphy_15.gif',
];
