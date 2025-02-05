import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  User,
  DiscordAPIError,
  GuildMember,
} from 'discord.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { Command } from '../../interfaces/command';
import { handleMemberWarn } from '../../events/onMemberWarn';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

export async function warnUser(
  member: GuildMember,
  issuer: GuildMember,
  reason: string,
  isAutomatic: boolean = false
): Promise<{
  success: boolean;
  warnId?: number;
  error?: string;
  timeoutDuration?: number;
}> {
  try {
    const targetUser = await prisma.user.upsert({
      where: { id: member.user.id },
      update: { warns: { increment: 1 } },
      create: { id: member.user.id, warns: 1 },
    });

    const { id } = await prisma.warn.create({
      data: {
        reason: isAutomatic ? `[AUTO] ${reason}` : reason,
        issuerId: issuer.id,
        targetId: member.user.id,
      },
    });

    const timeoutDuration = calculateTimeoutDuration(targetUser.warns);
    const currentTimeoutEnd = member.communicationDisabledUntilTimestamp;

    let combinedTimeoutDuration = timeoutDuration;
    if (currentTimeoutEnd && currentTimeoutEnd > Date.now()) {
      const remainingTime = currentTimeoutEnd - Date.now();
      combinedTimeoutDuration += remainingTime;
    }

    await member.timeout(combinedTimeoutDuration, `Accumulated Warns: ${targetUser.warns}`);

    await handleMemberWarn(
      member.user,
      issuer.user,
      reason,
      targetUser.warns,
      combinedTimeoutDuration,
      member.guild,
      id
    );

    await sendWarningDM(member.user, reason, combinedTimeoutDuration, isAutomatic);

    return {
      success: true,
      warnId: id,
      timeoutDuration: combinedTimeoutDuration,
    };
  } catch (error) {
    logger.error('Error processing warning:', error);
    let errorMessage = 'An error occurred while processing the warning.';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage =
        error.code === 'P2002' ? 'There was a unique constraint violation.' : `Database error: ${error.message}`;
    } else if (error instanceof DiscordAPIError) {
      errorMessage = `Discord API error: ${error.message}`;
    } else if (error instanceof Error && error.name === 'PermissionError') {
      errorMessage = `Permission error: ${error.message}`;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

async function sendWarningDM(user: User, reason: string, timeoutDuration: number | null, isAutomatic: boolean = false) {
  const warningType = isAutomatic ? 'Automatic warning' : 'Warning';
  let dmMessage = `${warningType}: ${reason}`;

  if (timeoutDuration !== null) {
    dmMessage += `\nYou have been placed in timeout for ${timeoutDuration / 60000} minutes due to accumulated warnings.`;
  }

  if (isAutomatic) {
    dmMessage +=
      '\n\nThis warning was automatically issued by our risk detection system. If you believe this was a mistake, please contact the moderators.';
  }

  try {
    const dmChannel = await user.createDM();
    await dmChannel.send(dmMessage);
    return true;
  } catch (err) {
    logger.error('Failed to send warning DM:', err);
    return false;
  }
}

function calculateTimeoutDuration(warnCount: number): number {
  let minutes;

  switch (warnCount) {
    case 1:
      minutes = 5;
      break;
    case 2:
      minutes = 10;
      break;
    case 3:
      minutes = 60;
      break;
    default:
      minutes = 24 * 60;
      break;
  }

  return minutes * 60000;
}

const Warn: Command = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => option.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption((option) =>
      option.setName('reason').setDescription('The reason for the warning').setRequired(true)
    ),

  async run(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    const userOption = interaction.options.getUser('user', true);
    const reasonOption = interaction.options.getString('reason');

    if (!reasonOption) {
      await interaction.reply({ content: 'Please provide a reason for the warning.', ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const member = await interaction.guild.members.fetch(userOption.id);
      const issuer = await interaction.guild.members.fetch(interaction.user.id);

      const result = await warnUser(member, issuer, reasonOption, false);

      if (result.success) {
        await interaction.channel?.send(`<@${userOption.id}> has been warned. Reason: ${reasonOption}`);
        await interaction.editReply(
          `Successfully warned <@${userOption.id}>. User is timed out for ${result.timeoutDuration! / 60000} minutes.`
        );
      } else {
        await interaction.editReply({ content: result.error });
      }
    } catch (error) {
      logger.error('Error in warn command:', error);
      await interaction.editReply({
        content: 'Failed to process the warning. The user might not be in the server anymore.',
      });
    }
  },
};

export default Warn;
