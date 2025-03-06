import { Guild, GuildAuditLogsEntry, EmbedBuilder, TextChannel, AuditLogEvent, Role } from 'discord.js';
import Config from '../config';
import logger from '../utils/logger';

export const onMemberRoleUpdate = async (auditLogEntry: GuildAuditLogsEntry, guild: Guild) => {
  if (auditLogEntry.action !== AuditLogEvent.MemberRoleUpdate) {
    return;
  }

  if (!auditLogEntry.executorId || !auditLogEntry.targetId) {
    return logger.info('Executor ID or target ID is missing from the audit log entry.');
  }

  if (auditLogEntry.executorId !== '874059310869655662') return; // Only trigger if it's VVarden

  const targetUser = await guild.members.fetch(auditLogEntry.targetId);

  if (!targetUser) {
    return logger.info('Unable to find targetUser following MemberRoleUpdate triggering by VVarden')
  }

  if (targetUser.roles.cache.has(Config.MEMBER_ROLE_ID)) return; // Member still has the role, no further action required

  await targetUser.roles.add(Config.MEMBER_ROLE_ID);

  logger.info(`${targetUser.user.username} was unblacklisted by VVarden and lost the default member role, role has been returned.`);
};
