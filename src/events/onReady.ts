import { Client } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { CommandList } from '../commands';
import Config from '../config';

export const onReady = async (Bot: Client) => {
  const rest = new REST({ version: '9' }).setToken(Config.DISCORD_TOKEN);
  const commandData = CommandList.map((command) => command.data.toJSON());
  await rest.put(Routes.applicationGuildCommands(Config.CLIENT_ID, Config.GUILD_ID), { body: commandData });
  console.log('Bot ready');
};
