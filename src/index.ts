import config from './config';
import { Client, Intents } from 'discord.js';
import { onInteraction } from './events/onInteraction';
import { onReady } from './events/onReady';
import { onMessageDelete } from './events/onMessageDelete';

const Bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

Bot.once('ready', async () => await onReady(Bot));

Bot.on('messageDelete', async (message) => await onMessageDelete(message));
Bot.on('interactionCreate', async (interaction) => await onInteraction(interaction));

Bot.login(config.DISCORD_TOKEN);
