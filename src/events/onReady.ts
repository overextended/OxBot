import { Client, TextChannel, REST, Routes, ActivityType, EmbedBuilder } from 'discord.js';
import commands from '../handlers/commandHandler';
import Config from '../config';
import logger from '../utils/logger';
import { Command } from '../interfaces/command';

function organizeCommandsByCategory(commands: Map<string, Command>) {
  const categorizedCommands = new Map<string, string[]>();

  for (const [name, command] of commands) {
    const category = command.category || 'Uncategorized';
    if (!categorizedCommands.has(category)) {
      categorizedCommands.set(category, []);
    }
    categorizedCommands.get(category)?.push(`\`${name}\``);
  }

  return Array.from(categorizedCommands.entries()).map(([category, cmds]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: cmds.sort().join(', '),
    inline: false,
  }));
}

export const onReady = async (Bot: Client) => {
  const rest = new REST({ version: '10' }).setToken(Config.DISCORD_TOKEN);
  const commandData = Array.from(commands.values()).map((command) => command.data.toJSON());

  try {
    logger.info('Clearing existing commands...');

    if (Config.NODE_ENV === 'development') {
      await rest.put(Routes.applicationGuildCommands(Config.CLIENT_ID, Config.GUILD_ID), { body: [] });
      logger.info('Cleared guild commands');

      await rest.put(Routes.applicationCommands(Config.CLIENT_ID), { body: [] });
      logger.info('Cleared global commands');

      logger.info('Development mode: Registering guild commands...');
      await rest.put(Routes.applicationGuildCommands(Config.CLIENT_ID, Config.GUILD_ID), { body: commandData });
      logger.info(`Successfully registered ${commandData.length} guild commands`);
    } else {
      await rest.put(Routes.applicationGuildCommands(Config.CLIENT_ID, Config.GUILD_ID), { body: [] });
      logger.info('Cleared guild commands');

      logger.info('Production mode: Registering global commands...');
      await rest.put(Routes.applicationCommands(Config.CLIENT_ID), { body: commandData });
      logger.info(`Successfully registered ${commandData.length} global commands`);
    }

    const logChannel = Bot.channels.cache.get(Config.LOG_CHANNEL) as TextChannel;
    const commandCount = commandData.length;

    const embed = new EmbedBuilder()
      .setTitle('🤖 Bot Started')
      .setDescription(`Successfully started and registered **${commandCount}** commands in ${Config.NODE_ENV} mode.`)
      .addFields(organizeCommandsByCategory(commands))
      .setColor(0x00ff00)
      .setTimestamp()
      .setFooter({
        text: `${Config.NODE_ENV.charAt(0).toUpperCase() + Config.NODE_ENV.slice(1)} Mode • Bot Initialization`,
        iconURL: Bot.user?.avatarURL() || '',
      });

    if (logChannel) {
      await logChannel.send({ embeds: [embed] });
    }

    logger.info('Bot ready');

    Bot.user?.setPresence({
      activities: [{ name: 'https://overextended.dev/', type: ActivityType.Custom }],
      status: 'online',
    });
  } catch (error) {
    logger.error('Failed to register commands:', error);
  }
};
