import Config from './config';
import { Client, Intents } from 'discord.js';
import { onInteraction } from './events/onInteraction';
import { onReady } from './events/onReady';
import { onMemberBan } from './events/onMemberBan';
import { onMemberRemove } from './events/onMemberRemove';
import { onMessageDelete } from './events/onMessageDelete';

export const Bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MEMBERS],
});

Bot.once('ready', async () => await onReady(Bot));

Bot.on('guildMemberRemove', async (member) => await onMemberRemove(member));
Bot.on('guildBanAdd', async (ban) => await onMemberBan(ban));
Bot.on('interactionCreate', async (interaction) => await onInteraction(interaction));
Bot.on('messageDelete', async (message) => await onMessageDelete(message));

Bot.login(Config.DISCORD_TOKEN);
