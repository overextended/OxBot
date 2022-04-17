import config from "./config";
import { Client, Intents } from "discord.js";
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";

const Bot = new Client({intents: [Intents.FLAGS.GUILDS]})

Bot.once('ready', async () => await onReady(Bot))

Bot.on('interactionCreate', async (interaction) => await onInteraction(interaction))

Bot.login(config.DISCORD_TOKEN)