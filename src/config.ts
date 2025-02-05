import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.TOKEN;
const LOG_CHANNEL = process.env.LOG_CHANNEL;
const MEMBER_ACTIVITY_CHANNEL = process.env.MEMBER_ACTIVITY_CHANNEL;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID || !LOG_CHANNEL || !MEMBER_ACTIVITY_CHANNEL) {
  throw new Error('Missing environment variables');
}

interface Env {
  DISCORD_TOKEN: string;
  CLIENT_ID: string;
  GUILD_ID: string;
  LOG_CHANNEL: string;
  MEMBER_ACTIVITY_CHANNEL: string;
}

const Config: Env = {
  CLIENT_ID,
  GUILD_ID,
  DISCORD_TOKEN,
  LOG_CHANNEL,
  MEMBER_ACTIVITY_CHANNEL,
};

export default Config;
