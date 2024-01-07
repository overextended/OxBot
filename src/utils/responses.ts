import { guidelines } from '../constants';

interface ChannelResponses {
  [key: string]: string[];
}

export const guidelineResponses: ChannelResponses = {
  // general
  '813030955598086177': [
    `Read the channel description, dip shit.`,
    `Does this look like the support channel? Read ${guidelines}.`,
    `For Support Read: ${guidelines}`,
    `I wonder what this is for? ${guidelines}`,
    `For fucks sake, read ${guidelines}`,
    `Have you had a chance to review our ${guidelines} channel?`,
  ],
  // music
  '871124377129848843': [
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTQyd2V2ZWR0Y2twN2JqZnh5ZTRpOXY5dmxtbmQ3dmNqb2Q4bTNuOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yetxv6NWi0MyzJn7P0/giphy.gif',
  ],
  // shitposting
  '844240881283366962': [
    'https://media4.giphy.com/media/l1J3nvV8lJYA5THnG/giphy.gif?cid=ecf05e47818nxlmts5l1i5semyzy9dpisnxqcrv1ofek69sf&ep=v1_gifs_related&rid=giphy.gif',
    'https://media3.giphy.com/media/5Cjamgy5sWlOaWODms/giphy.gif?cid=ecf05e47h27r4kizkezjat9chicil5rjfv29ji8ms1715brz&ep=v1_gifs_related&rid=giphy.gif'
  ],
  // gaming
  '894221760315162754': [
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExczk5YzBzOTBkMnN3dDI2Y21mOTZkYjVidHBhazgycGVlcm94MjV2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Yycc82XEuWDaLLi2GV/giphy.gif',
  ],
  // ox_core
  '951683419769831465': [
    `Read the channel description, dip shit.`,
  ],
};

export const resourceResponses: string[] = [
  "Before using a resource it's usually a good idea to read the documentation. [READ THE DOCS HERE!](https://overextended.dev/)",
  "[RTFM!](https://overextended.dev/)",
];