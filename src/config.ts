import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID_DEV = process.env.GUILD_ID_DEV;
const GUILD_ID_OX = process.env.GUILD_ID_OX;
const DISCORD_TOKEN = process.env.TOKEN;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID_DEV || !GUILD_ID_OX) {
  throw new Error('Missing environment variables');
}

interface Env {
  DISCORD_TOKEN: string;
  CLIENT_ID: string;
  GUILD_ID_DEV: string;
  GUILD_ID_OX: string;
}

const config: Env = {
  CLIENT_ID,
  GUILD_ID_DEV,
  GUILD_ID_OX,
  DISCORD_TOKEN,
};

export default config;
