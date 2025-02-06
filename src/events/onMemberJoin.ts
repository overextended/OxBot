import { GuildMember, TextChannel } from 'discord.js';
import Config from '../config';
import logger from '../utils/logger';
import { assessAndWarnHighRiskUser } from '../utils/riskScoring';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MAX_RETRIES = 3;
const RETRY_DELAY = 5 * 60 * 1000;

export const onMemberJoin = async (member: GuildMember) => {
  logger.debug(`Member join event triggered for ${member.user.tag} (${member.id})`);

  const channel = member.guild.channels.cache.get(Config.MEMBER_ACTIVITY_CHANNEL) as TextChannel;
  if (!channel) {
    logger.error(`Member activity channel ${Config.MEMBER_ACTIVITY_CHANNEL} not found`);
    return;
  }

  try {
    const welcomeMessage = `Welcome <@${member.user.id}> (${member.user.username}) to the server!`;
    await channel.send(welcomeMessage);
    logger.debug(`Sent welcome message for ${member.user.tag}`);
  } catch (error) {
    logger.error(`Failed to send welcome message for ${member.user.tag}:`, error);
  }

  try {
    await prisma.user.upsert({
      where: {
        id: member.user.id,
      },
      update: {
        joinedAt: member.joinedAt || new Date(),
      },
      create: {
        id: member.user.id,
        warns: 0,
        timeouts: 0,
        messageCount: 0,
        joinedAt: member.joinedAt || new Date(),
        riskScore: 0,
      },
    });
    logger.info(`Created/Updated initial user record for ${member.user.tag}`);
  } catch (error) {
    logger.error(
      `Error creating initial user record for ${member.user.tag}:`,
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error
    );
  }

  const role = member.guild.roles.cache.get(Config.MEMBER_ROLE_ID);

  if (!role) {
    logger.error(`Member role not found: ${Config.MEMBER_ROLE_ID}`);
    return;
  }

  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      await member.roles.add(role);
      logger.info(`Assigned role '${role.name}' to ${member.displayName}`);
      break;
    } catch (error) {
      logger.error(`Failed to assign role to ${member.displayName} (Attempt ${retries + 1}/${MAX_RETRIES}):`, error);
      retries++;

      if (retries < MAX_RETRIES) {
        logger.info(`Waiting ${RETRY_DELAY / 1000} seconds before retrying role assignment...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  try {
    logger.debug(`Starting risk assessment for ${member.user.tag}`);
    await assessAndWarnHighRiskUser(member, member.guild);
  } catch (error) {
    logger.error(
      `Risk assessment failed for ${member.user.tag}:`,
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error
    );
  }
};
