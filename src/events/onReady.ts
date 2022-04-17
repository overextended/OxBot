import { Client } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { CommandList } from '../commands';
import config from '../config';

export const onReady = async (Bot: Client) => {
  const rest = new REST({ version: '9' }).setToken(config.DISCORD_TOKEN);
  const commandData = CommandList.map((command) => command.data.toJSON());
  await rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID_DEV), { body: commandData });
  console.log('Bot ready');
};
