import { Command } from '../interfaces/command';
import Mod from './mod';
import Ping from './ping';
import Repo from './repo';

export const CommandList: Command[] = [Ping, Repo, Mod];
