import { Command } from '../interfaces/command';
import fs from 'fs';
import path from 'path';

const commands = new Map<string, Command>();

const commandFiles = fs
  .readdirSync(path.join(__dirname, '../commands'))
  .filter((file) => (file.endsWith('.ts') || file.endsWith('.js')) && file !== 'index.ts');

for (const file of commandFiles) {
  const commandModule = require(path.join(__dirname, '../commands', file));
  const command: Command = commandModule.default;
  commands.set(command.data.name, command);
}

export default commands;
