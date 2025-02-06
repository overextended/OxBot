import dotenv from 'dotenv';

dotenv.config();

const envVars = {
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  DISCORD_TOKEN: process.env.TOKEN,
  LOG_CHANNEL: process.env.LOG_CHANNEL,
  MEMBER_ACTIVITY_CHANNEL: process.env.MEMBER_ACTIVITY_CHANNEL,
  MEMBER_ROLE_ID: process.env.MEMBER_ROLE_ID,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

const missingVars = Object.entries(envVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
}

interface Env {
  DISCORD_TOKEN: string;
  CLIENT_ID: string;
  GUILD_ID: string;
  LOG_CHANNEL: string;
  MEMBER_ACTIVITY_CHANNEL: string;
  MEMBER_ROLE_ID: string;
  NODE_ENV: string;
}

const Config: Env = {
  CLIENT_ID: envVars.CLIENT_ID!,
  GUILD_ID: envVars.GUILD_ID!,
  DISCORD_TOKEN: envVars.DISCORD_TOKEN!,
  LOG_CHANNEL: envVars.LOG_CHANNEL!,
  MEMBER_ACTIVITY_CHANNEL: envVars.MEMBER_ACTIVITY_CHANNEL!,
  MEMBER_ROLE_ID: envVars.MEMBER_ROLE_ID!,
  NODE_ENV: envVars.NODE_ENV,
};

export default Config;
