import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Command } from '../../interfaces/command';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

const Unban: Command = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => option.setName('user').setDescription('The user to unban').setRequired(true))
    .addStringOption((option) =>
      option.setName('reason').setDescription('The reason for the unban').setRequired(false)
    ),

  async run(interaction: CommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const userOption = interaction.options.get('user');
    const reasonOption = interaction.options.get('reason');

    const user = userOption?.user;
    const reason = (reasonOption?.value as string) || 'No reason provided';

    if (!user) {
      await interaction.editReply('User not found!');
      return;
    }

    try {
      const banRecord = await prisma.ban.findFirst({
        where: {
          targetId: user.id,
        },
      });

      if (banRecord) {
        await prisma.ban.delete({
          where: {
            id: banRecord.id,
          },
        });
      }

      await interaction.guild.members.unban(user, reason);
      await interaction.editReply(`Unbanned <@${user.id}>. Reason: ${reason}`);
    } catch (error) {
      logger.error(error);
      await interaction.editReply('An error occurred while processing the unban.');
    }
  },
};

export default Unban;
