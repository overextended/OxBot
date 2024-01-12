import { Command } from '../interfaces/command';
import fs from 'fs';
import path from 'path';

const commands = new Map<string, Command>();

function loadCommands(directory: string): void {
  const commandFiles = fs.readdirSync(directory);

  for (const file of commandFiles) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      if (file === 'index.ts') continue;

      const commandModule = require(fullPath);
      const command: Command = commandModule.default;
      commands.set(command.data.name, command);

      console.log(`Loaded command ${command.data.name}`);
    }
  }
}

loadCommands(path.join(__dirname, '../commands'));

export default commands;
