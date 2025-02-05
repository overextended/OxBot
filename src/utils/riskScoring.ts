import { GuildMember, Message, TextChannel, Guild, Collection, AuditLogEvent } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import logger from './logger';
import { warnUser } from '../commands/moderation/warn';

const prisma = new PrismaClient();

interface RiskFactors {
  accountAge: number;
  serverAge: number;
  messageActivity: number;
  messageContent: number;
  usernameRisk: number;
  kickHistory: number;
}

interface RiskAssessment {
  score: number;
  factors: string[];
  details: {
    totalMessages: number;
    linkCount: number;
    accountAgeDays: number;
    serverAgeDays: number;
    hasNormalMessages: boolean;
    kickCount: number;
  };
}

const RISK_WEIGHTS: RiskFactors = {
  accountAge: 30,
  serverAge: 20,
  messageActivity: 15,
  messageContent: 15,
  usernameRisk: 5,
  kickHistory: 15,
};

const USERNAME_PATTERNS = {
  randomLetterNumber: /^[a-z0-9]{8,}$/i,
  excessiveNumbers: /\d{4,}/,
  suspiciousWords: /(bot|spam|nitro|free|giveaway|discord\.gift)/i,
  noLetters: /^[^a-z]*$/i,
  repeatingChars: /(.)\1{4,}/,
  leetSpeak: /[0-9]+[a-z]+[0-9]+[a-z]+/i,
};

async function checkPriorKicks(member: GuildMember): Promise<number> {
  try {
    const auditLogs = await member.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberKick,
      limit: 100,
    });

    const userKicks = auditLogs.entries.filter((entry) => entry.targetId === member.id);
    logger.debug(`Found ${userKicks.size} prior kicks for user ${member.id}`);
    return userKicks.size;
  } catch (error) {
    logger.error(`Error checking kick history for ${member.id}:`, error);
    return 0;
  }
}

async function fetchRecentMessages(channel: TextChannel, userId: string): Promise<Message[]> {
  const messages: Message[] = [];
  let lastId: string | undefined;

  try {
    logger.debug(`Fetching messages for user ${userId} in channel ${channel.name}`);
    for (let i = 0; i < 5; i++) {
      const options: any = { limit: 100 };
      if (lastId) options.before = lastId;

      const fetchedMessages = (await channel.messages.fetch(options)) as unknown as Collection<string, Message>;
      if (fetchedMessages.size === 0) break;

      const userMessages = fetchedMessages.filter((msg) => msg.author.id === userId);
      messages.push(...userMessages.values());
      lastId = fetchedMessages.last()?.id;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    logger.debug(`Found ${messages.length} messages for user ${userId} in channel ${channel.name}`);
  } catch (error) {
    logger.error(`Error fetching messages for user ${userId} in channel ${channel.name}:`, error);
  }

  return messages;
}

async function analyzeMessageContent(messages: Message[]): Promise<{
  linkCount: number;
  hasNormalMessages: boolean;
}> {
  let linkCount = 0;
  let hasNormalMessages = false;
  const linkRegex = /https?:\/\/[^\s]+/g;

  for (const message of messages) {
    const links = message.content.match(linkRegex);
    if (links) {
      linkCount += links.length;
    }

    const contentWithoutLinks = message.content.replace(linkRegex, '').trim();
    if (contentWithoutLinks.length > 10) {
      hasNormalMessages = true;
    }
  }

  return { linkCount, hasNormalMessages };
}

function calculateUsernameRiskScore(username: string): { score: number; factors: string[] } {
  const factors: string[] = [];
  let score = 0;

  for (const [pattern, regex] of Object.entries(USERNAME_PATTERNS)) {
    if (regex.test(username)) {
      score += 0.2;
      factors.push(`Suspicious username pattern: ${pattern}`);
    }
  }

  return { score: Math.min(score, 1), factors };
}

async function assessUserRisk(member: GuildMember, textChannels: TextChannel[]): Promise<RiskAssessment> {
  logger.debug(`Starting risk assessment for user ${member.user.tag} (${member.id})`);
  const now = Date.now();
  const factors: string[] = [];
  let totalRiskScore = 0;

  // 1. Account Age Assessment
  const accountAgeDays = (now - member.user.createdTimestamp) / (1000 * 60 * 60 * 24);
  let accountAgeRisk = 0;
  if (accountAgeDays < 30) {
    accountAgeRisk = 1 - accountAgeDays / 30;
    factors.push(`New account (${accountAgeDays.toFixed(1)} days old)`);
    logger.debug(`User ${member.id} has new account risk: ${accountAgeRisk}`);
  }
  totalRiskScore += accountAgeRisk * RISK_WEIGHTS.accountAge;

  // 2. Server Age Assessment
  const serverAgeDays = member.joinedTimestamp ? (now - member.joinedTimestamp) / (1000 * 60 * 60 * 24) : 0;
  let serverAgeRisk = 0;
  if (serverAgeDays < 7) {
    serverAgeRisk = 1 - serverAgeDays / 7;
    factors.push(`Recent join (${serverAgeDays.toFixed(1)} days ago)`);
    logger.debug(`User ${member.id} has server age risk: ${serverAgeRisk}`);
  }
  totalRiskScore += serverAgeRisk * RISK_WEIGHTS.serverAge;

  // 3. Message Analysis
  logger.debug(`Starting message analysis for user ${member.id}`);
  let totalMessages: Message[] = [];
  for (const channel of textChannels) {
    const messages = await fetchRecentMessages(channel, member.id);
    totalMessages = totalMessages.concat(messages);
  }

  // Message Activity Risk
  let activityRisk = 1;
  if (totalMessages.length > 0) {
    activityRisk = Math.max(0, 1 - totalMessages.length / 20);
    if (activityRisk > 0.5) {
      factors.push(`Low message activity (${totalMessages.length} messages)`);
    }
    logger.debug(`User ${member.id} has activity risk: ${activityRisk}`);
  } else {
    factors.push('No messages found');
  }
  totalRiskScore += activityRisk * RISK_WEIGHTS.messageActivity;

  // Message Content Risk
  const { linkCount, hasNormalMessages } = await analyzeMessageContent(totalMessages);
  let contentRisk = 0;
  if (linkCount > 0 && !hasNormalMessages) {
    contentRisk = Math.min(1, linkCount / 5);
    factors.push(`Only posts links (${linkCount} links)`);
  } else if (!hasNormalMessages && totalMessages.length > 0) {
    contentRisk = 0.8;
    factors.push('No substantial messages');
  }
  logger.debug(`User ${member.id} has content risk: ${contentRisk}`);
  totalRiskScore += contentRisk * RISK_WEIGHTS.messageContent;

  // 4. Username Risk
  const { score: usernameRisk, factors: usernameFactors } = calculateUsernameRiskScore(member.user.username);
  totalRiskScore += usernameRisk * RISK_WEIGHTS.usernameRisk;
  factors.push(...usernameFactors);
  logger.debug(`User ${member.id} has username risk: ${usernameRisk}`);

  // 5. Kick History Check
  const kickCount = await checkPriorKicks(member);
  if (kickCount > 0) {
    const kickRisk = Math.min(kickCount * 0.2, 1);
    totalRiskScore += kickRisk * RISK_WEIGHTS.kickHistory;
    factors.push(`Previously kicked ${kickCount} time(s)`);
    logger.debug(`User ${member.id} has kick history risk: ${kickRisk}`);
  }

  const finalScore = Math.min(100, totalRiskScore);
  logger.info(`Risk assessment complete for ${member.user.tag} (${member.id}) - Final Score: ${finalScore}`);

  return {
    score: finalScore,
    factors,
    details: {
      totalMessages: totalMessages.length,
      linkCount,
      accountAgeDays,
      serverAgeDays,
      hasNormalMessages,
      kickCount,
    },
  };
}

export async function assessAndWarnHighRiskUser(member: GuildMember, guild: Guild): Promise<void> {
  try {
    logger.debug(`Starting high risk assessment for ${member.user.tag} (${member.id})`);

    let textChannels: TextChannel[];
    try {
      textChannels = guild.channels.cache
        .filter(
          (channel) =>
            channel.type === 0 && channel.viewable && channel.permissionsFor(guild.members.me!)?.has('ViewChannel')
        )
        .map((channel) => channel as TextChannel);
      logger.debug(`Found ${textChannels.length} accessible text channels`);
    } catch (error) {
      logger.error(`Error getting text channels for ${member.id}:`, error);
      return;
    }

    let assessment;
    try {
      assessment = await assessUserRisk(member, textChannels);
    } catch (error) {
      logger.error(`Error during risk assessment for ${member.id}:`, error);
      return;
    }

    try {
      await prisma.user.upsert({
        where: { id: member.id },
        update: {
          riskScore: Math.round(assessment.score),
        },
        create: {
          id: member.id,
          riskScore: Math.round(assessment.score),
          warns: 0,
          timeouts: 0,
          messageCount: 0,
        },
      });
      logger.debug(`Updated risk score in database for ${member.id}: ${assessment.score}`);
    } catch (error) {
      logger.error(`Error updating user risk score in database for ${member.id}:`, error);
      return;
    }

    if (assessment.score > 80) {
      try {
        const reason = `Potential High Risk User - Risk Score: ${Math.round(assessment.score)}%\nFactors:\n${assessment.factors.join('\n')}`;

        let botMember;
        try {
          botMember = await guild.members.fetch(guild.client.user!.id);
        } catch (error) {
          logger.error(`Error fetching bot member for ${member.id}:`, error);
          return;
        }

        const warnResult = await warnUser(member, botMember, reason, true);

        if (!warnResult.success) {
          logger.error(`Failed to warn high-risk user ${member.id}: ${warnResult.error}`);
        } else {
          logger.info(
            `Issued warning to high-risk user ${member.user.tag} (${member.id}) with warn ID: ${warnResult.warnId}`
          );
        }
      } catch (error) {
        logger.error(`Failed to warn high-risk user ${member.id}:`, error || 'No error details available');
      }
    } else {
      logger.debug(`User ${member.id} not high risk enough for warning (score: ${assessment.score})`);
    }
  } catch (error) {
    logger.error(`Error in high risk assessment for ${member.id}:`, error || 'No error details available');
  }
}

export { assessUserRisk, RiskAssessment };
