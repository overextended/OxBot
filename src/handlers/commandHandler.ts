import { Command } from '../interfaces/command';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

const commands = new Map<string, Command>();

function loadCommands(directory: string, isRoot = true): number {
  const commandFiles = fs.readdirSync(directory);
  let commandCount = 0;  // Initialize command counter for this level

  for (const file of commandFiles) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      commandCount += loadCommands(fullPath, false);  // Recursively load commands from subdirectories
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      if (file === 'index.ts' || file === 'index.js') continue;  // Skip index files

      const commandModule = require(fullPath);
      const command: Command = commandModule.default;
      commands.set(command.data.name, command);
      commandCount++;  // Increment the counter for each loaded command
    }
  }

  if (isRoot) {
    logger.info(`${commandCount} command(s) loaded`);  // Log total commands loaded at the root level
  }
  return commandCount;  // Return the count of loaded commands from this call
}

const totalCommandsLoaded = loadCommands(path.join(__dirname, '../commands'));  // Initiate loading from the root directory

export default commands;
