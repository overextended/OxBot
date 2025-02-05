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
      commandCount += loadCommands(fullPath, false);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      if (file === 'index.ts' || file === 'index.js') continue;

      const commandModule = require(fullPath);
      const command: Command = commandModule.default;
      commands.set(command.data.name, command);
      commandCount++;
    }
  }

  if (isRoot) {
    logger.info(`${commandCount} command(s) loaded`);
  }
  return commandCount;
}

loadCommands(path.join(__dirname, '../commands'));

export default commands;