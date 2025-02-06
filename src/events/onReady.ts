import { Client, TextChannel, REST, Routes, ActivityType, EmbedBuilder } from 'discord.js';
import commands from '../handlers/commandHandler';
import Config from '../config';
import logger from '../utils/logger';

export const onReady = async (Bot: Client) => {
  const rest = new REST({ version: '10' }).setToken(Config.DISCORD_TOKEN);
  const commandData = Array.from(commands.values()).map((command) => command.data.toJSON());

  await rest.put(Routes.applicationCommands(Config.CLIENT_ID), { body: commandData });

  const logChannel = Bot.channels.cache.get(Config.LOG_CHANNEL) as TextChannel;

  const commandCount = commandData.length;
  const embed = new EmbedBuilder()
    .setTitle('Bot Started')
    .setDescription(`Successfully started and registered **${commandCount}** commands.`)
    .setColor(0x00ff00)
    .setTimestamp()
    .setFooter({ text: 'Bot Initialization', iconURL: Bot.user?.avatarURL() || '' });

  if (logChannel) {
    await logChannel.send({ embeds: [embed] });
  }

  logger.info('Bot ready');

  Bot.user?.setPresence({
    activities: [{ name: 'https://overextended.dev/', type: ActivityType.Custom }],
    status: 'online',
  });
};
