import { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { Command } from '../../interfaces/command';

const prisma = new PrismaClient();

const Unban: Command = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user')
    .addUserOption((option) => option.setName('user').setDescription('The user to unban').setRequired(true))
    .addStringOption((option) =>
      option.setName('reason').setDescription('The reason for the unban').setRequired(false)
    ),

  async run(interaction: CommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply({ content: 'Insufficient permissions.', ephemeral: true });
      return;
    }

    const userOption = interaction.options.get('user');
    const reasonOption = interaction.options.get('reason');

    const user = userOption?.user;
    const reason = (reasonOption?.value as string) || 'No reason provided';

    if (!user) {
      await interaction.reply({ content: 'User not found!', ephemeral: true });
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
      await interaction.reply({ content: `Unbanned <@${user.id}>. Reason: ${reason}`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while processing the unban.', ephemeral: true });
    }
  },
};

export default Unban;
