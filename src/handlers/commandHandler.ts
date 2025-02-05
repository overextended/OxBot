import { Command } from '../interfaces/command';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

const commands = new Map<string, Command>();

async function loadCommands(directory: string, isRoot = true): Promise<number> {
  const commandFiles = fs.readdirSync(directory);
  let commandCount = 0;

  for (const file of commandFiles) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      commandCount += await loadCommands(fullPath, false);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      if (file === 'index.ts' || file === 'index.js') continue;

      try {
        const commandModule = await import(fullPath);
        if (!commandModule.default) {
          logger.warn(`Skipping ${file}: No default export found.`);
          continue;
        }

        const command: Command = commandModule.default;
        commands.set(command.data.name, command);
        commandCount++;
      } catch (error) {
        const errorMessage = (error as Error).message;
        logger.error(`Failed to load command ${file}: ${errorMessage}`);
      }
    }
  }

  if (isRoot) {
    logger.info(`${commandCount} command(s) loaded`);
  }
  return commandCount;
}

loadCommands(path.join(__dirname, '../commands')).catch((err) => logger.error(`Command loading failed: ${err.message}`));

export default commands;
