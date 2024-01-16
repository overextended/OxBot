import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, GuildMember } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Command } from '../../interfaces/command';

const prisma = new PrismaClient();

const ClearWarn: Command = {
  data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('Clear warnings of a user')
    .addUserOption((option) =>
      option.setName('user').setDescription('The user whose warnings will be cleared').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('warnid')
        .setDescription('The warning ID to clear, or "all" to clear all warnings')
        .setRequired(true)
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
    const member: GuildMember | null = await interaction.guild.members.fetch(userOption.id).catch(() => null);

    if (!member) {
      await interaction.reply({ content: 'User not found in the guild.', ephemeral: true });
      return;
    }
    const warnIdOption = (interaction.options as any).getString('warnid', true);

    try {
      if (warnIdOption.toLowerCase() === 'all') {
        // Clear all warnings
        await prisma.warn.deleteMany({ where: { targetId: userOption.id } });

        // Remove timeout if present
        if (member.communicationDisabledUntilTimestamp && member.communicationDisabledUntilTimestamp > Date.now()) {
          await member.timeout(null);
        }

        await interaction.reply({
          content: `Cleared all warnings and removed timeout for <@${userOption.id}>.`,
          ephemeral: true,
        });
      } else {
        // Clear specific warning
        const warnId = parseInt(warnIdOption);
        if (isNaN(warnId)) {
          await interaction.reply({ content: 'Invalid warning ID provided.', ephemeral: true });
          return;
        }

        const result = await prisma.warn.deleteMany({
          where: {
            id: warnId,
            targetId: userOption.id,
          },
        });

        if (result.count === 0) {
          await interaction.reply({ content: 'No warning found with the provided ID for this user.', ephemeral: true });
        } else {
          await interaction.reply({
            content: `Cleared warning ID ${warnId} for <@${userOption.id}>.`,
            ephemeral: true,
          });
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while clearing the warnings.', ephemeral: true });
    }
  },
};

export default ClearWarn;
