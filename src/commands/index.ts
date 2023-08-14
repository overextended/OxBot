import { Command } from '../interfaces/command';
import Mod from './mod';
import Ping from './ping';
import Repo from './repo';
import Docs from './docs';
import Guild from './guild';
import Ox from './ox';
import Release from './release';
import issue from './issue';

export const CommandList: Command[] = [Ping, Repo, Mod, Docs, Guild, Ox, Release, BulkUnban, issue];
