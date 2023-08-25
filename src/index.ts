import Config from './config';
import { Client, GatewayIntentBits, Events, AuditLogEvent } from 'discord.js';
import { onInteraction } from './events/onInteraction';
import { onReady } from './events/onReady';
import { onMemberBan } from './events/onMemberBan';
import { onMemberUnban } from './events/onMemberUnban';
import { onMemberRemove } from './events/onMemberRemove';
import { onMessageDelete } from './events/onMessageDelete';

export const Bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

Bot.once('ready', async () => await onReady(Bot));

Bot.on(Events.GuildAuditLogEntryCreate, async (auditLogEntry, guild) => {
  if (auditLogEntry.action === AuditLogEvent.MemberBanAdd) {
    await onMemberBan(auditLogEntry, guild);
  } else if (auditLogEntry.action === AuditLogEvent.MemberBanRemove) {
    await onMemberUnban(auditLogEntry, guild);
  } else if (auditLogEntry.action === AuditLogEvent.MemberKick) {
    await onMemberRemove(auditLogEntry, guild);
  }
});

Bot.on('interactionCreate', async (interaction) => await onInteraction(interaction));
Bot.on('messageDelete', async (message) => await onMessageDelete(message));

Bot.login(Config.DISCORD_TOKEN);
