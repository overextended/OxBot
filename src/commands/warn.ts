import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, User } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Command } from '../interfaces/command';
import { handleMemberWarn } from '../events/onMemberWarn';

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

      const timeoutDuration = targetUser.warns % 2 === 0 ? calculateTimeoutDuration(targetUser.warns) : null;
      handleMemberWarn(
        userOption,
        interaction.user,
        reasonOptionRaw,
        targetUser.warns,
        timeoutDuration,
        interaction.guild
      );

      if (targetUser.warns % 2 === 0) {
        const member = await interaction.guild.members.fetch(userOption.id);
        await member.timeout(timeoutDuration, `Accumulated Warns: ${targetUser.warns}`);
        await sendWarningDM(userOption, reasonOptionRaw, timeoutDuration);

        await interaction.reply({
          content: `Warned <@${userOption.id}> and applied timeout. Reason: ${reasonOptionRaw}`,
          ephemeral: true,
        });
      } else {
        await sendWarningDM(userOption, reasonOptionRaw, null);
        await interaction.reply({ content: `Warned <@${userOption.id}>. Reason: ${reasonOptionRaw}`, ephemeral: true });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while processing the warning.', ephemeral: true });
    }
  },
};

async function sendWarningDM(user: User, reason: string, timeoutDuration: number | null) {
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
  }
}

function calculateTimeoutDuration(warnCount: number): number {
  return 60000 * warnCount; // 1 minute per warn
}

export default Warn;
