import { GuildMember, SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } from 'discord.js';
import { Command } from '../../interfaces/command';

const Kick: Command = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for kicking')),
  
  async run(interaction: CommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.KickMembers)) {
      await interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
      return;
    }

    const memberOption = interaction.options.getMember('user');
    const member = memberOption as GuildMember | null;

    if (!member) {
      await interaction.reply({ content: 'User not found or not kickable.', ephemeral: true });
      return;
    }

    const reasonOption = interaction.options.get('reason');
    const reason = (reasonOption?.value as string) || undefined;

    try {
      await member.kick(reason);
      await interaction.reply({ content: `Successfully kicked ${member.user.tag}.`, ephemeral: false });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Failed to kick the user.', ephemeral: true });
    }
  },
};

export default Kick;
