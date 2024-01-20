import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, User, DiscordAPIError } from 'discord.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { Command } from '../../interfaces/command';
import { handleMemberWarn } from '../../events/onMemberWarn';

const prisma = new PrismaClient();

const Warn: Command = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a user')
    .addUserOption((option) => option.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption((option) =>
      option.setName('reason').setDescription('The reason for the warning').setRequired(true)
    ),

  async run(interaction: CommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.KickMembers)) {
      await interaction.reply({ content: 'Insufficient permissions.', ephemeral: true });
      return;
    }

    const userOption = interaction.options.getUser('user', true);
    const reasonOptionRaw = interaction.options.get('reason')?.value;

    if (typeof reasonOptionRaw !== 'string') {
      await interaction.reply({ content: 'The reason must be a string.', ephemeral: true });
      return;
    }

    try {
      const targetUser = await prisma.user.upsert({
        where: { id: userOption.id },
        update: { warns: { increment: 1 } },
        create: { id: userOption.id, warns: 1 },
      });

      await prisma.warn.create({
        data: {
          reason: reasonOptionRaw,
          issuerId: interaction.user.id,
          targetId: userOption.id,
        },
      });

      const timeoutDuration = calculateTimeoutDuration(targetUser.warns);
      handleMemberWarn(
        userOption,
        interaction.user,
        reasonOptionRaw,
        targetUser.warns,
        timeoutDuration,
        interaction.guild
      );

      // Fetching Guild Member with Error Handling
      try {
        const member = await interaction.guild.members.fetch(userOption.id);
        await member.timeout(timeoutDuration, `Accumulated Warns: ${targetUser.warns}`);
      } catch (error) {
        console.error('Error fetching guild member:', error);
        await interaction.reply({
          content: 'Failed to find the specified user in the guild.',
          ephemeral: true,
        });
        return;
      }

      await sendWarningDM(interaction, userOption, reasonOptionRaw, timeoutDuration);

      await interaction.reply({
        content: `Warned <@${userOption.id}> and applied timeout of ${timeoutDuration}. Reason: ${reasonOptionRaw}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error processing the warning:', error);
      let errorMessage = 'An error occurred while processing the warning.';

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors, e.g., constraint violations
        if (error.code === 'P2002') {
          errorMessage = 'There was a unique constraint violation.';
        } else {
          errorMessage = `Database error: ${error.message}`;
        }
      } else if (error instanceof DiscordAPIError) {
        // Handle errors specific to Discord API interactions
        errorMessage = `Discord API error: ${error.message}`;
      } else if (error instanceof Error && error.name === 'PermissionError') {
        // Handle custom-defined permission errors, if any
        errorMessage = `Permission error: ${error.message}`;
      }

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  },
};

async function sendWarningDM(
  interaction: CommandInteraction,
  user: User,
  reason: string,
  timeoutDuration: number | null
) {
  let dmMessage = `You have been warned for the following reason: ${reason}.`;

  if (timeoutDuration !== null) {
    dmMessage += `\nAdditionally, you have been placed in timeout for ${
      timeoutDuration / 60000
    } minutes due to repeated warnings.`;
  }

  try {
    const dmChannel = await user.createDM();
    await dmChannel.send(dmMessage);
  } catch (err) {
    console.error('Failed to send DM:', err);
    await interaction.followUp({
      content: `Failed to send a DM to <@${user.id}>.`,
      ephemeral: true,
    });
  }
}

function calculateTimeoutDuration(warnCount: number): number {
  let minutes;

  switch (warnCount) {
    case 1:
      minutes = 5; // 5 minutes for the first warning
      break;
    case 2:
      minutes = 10; // 10 minutes for the second warning
      break;
    case 3:
      minutes = 60; // 1 hour for the third warning
      break;
    default:
      minutes = 24 * 60; // 1 day for the fourth and subsequent warnings
      break;
  }

  return minutes * 60000;
}

export default Warn;
