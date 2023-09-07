import { Client, TextChannel, REST, Routes } from 'discord.js';
import commands from '../handlers/commandHandler';
import Config from '../config';
import { log_channel } from '../settings.json';

export const onReady = async (Bot: Client) => {
  const rest = new REST({ version: '10' }).setToken(Config.DISCORD_TOKEN);
  const commandData = Array.from(commands.values()).map((command) => command.data.toJSON());
  await rest.put(Routes.applicationCommands(Config.CLIENT_ID), { body: commandData });
  const commandCount = commandData.length;
  const logMessage = `Bot started. ${commandCount} commands registered.`;
  const logChannel = Bot.channels.cache.get(log_channel) as TextChannel;
  logChannel && (await logChannel.send(logMessage));
  console.log('Bot ready');
};
