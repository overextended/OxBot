import { Command } from '../interfaces/command';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

const commands = new Map<string, Command>();

function loadCommands(directory: string, isRoot = true): number {
  const commandFiles = fs.readdirSync(directory);
  let commandCount = 0;

  for (const file of commandFiles) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      const categoryName = file;
      const categoryPath = fullPath;

      const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

      for (const commandFile of files) {
        if (commandFile === 'index.ts' || commandFile === 'index.js') continue;

        const commandPath = path.join(categoryPath, commandFile);
        const commandModule = require(commandPath);
        const command: Command = commandModule.default;

        command.category = categoryName;

        commands.set(command.data.name, command);
        logger.debug(`Loading command: ${command.data.name} (${categoryName})`);
        commandCount++;
      }
    }
  }

  if (isRoot) {
    logger.info(`${commandCount} command(s) loaded`);
    logger.debug(
      `Loaded commands: ${Array.from(commands.entries())
        .map(([name, cmd]) => `${name} (${cmd.category})`)
        .join(', ')}`
    );
  }
  return commandCount;
}

loadCommands(path.join(__dirname, '../commands'));

export default commands;
