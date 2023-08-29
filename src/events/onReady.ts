import { Client, TextChannel, REST, Routes } from 'discord.js';
import commands from '../handlers/commandHandler';
import Config from '../config';
import { log_channel } from '../settings.json';

export const onReady = async (Bot: Client) => {
  const rest = new REST({ version: '9' }).setToken(Config.DISCORD_TOKEN);
  const commandData = Array.from(commands.values()).map((command) => command.data.toJSON());
  await rest.put(Routes.applicationGuildCommands(Config.CLIENT_ID, Config.GUILD_ID), { body: commandData });
  const logChannel = Bot.channels.cache.get(log_channel) as TextChannel;
  logChannel && (await logChannel.send('Bot started.'));
  console.log('Bot ready');
};
