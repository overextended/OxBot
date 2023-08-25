import { GuildMember, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../interfaces/command';

const Mod: Command = {
  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Swing the ban hammer')
    .addStringOption((option) =>
      option
        .setName('action')
        .setDescription('Type of action to do')
        .setRequired(true)
        .addChoices({ name: 'ban', value: 'ban' }, { name: 'kick', value: 'kick' })
    )
    .addUserOption((option) => option.setName('user').setDescription('User to act upon').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Punishment reason')),
  async run(interaction) {
    const memberOption = interaction.options.get('user');
    const member = memberOption?.member as GuildMember;

    const reasonOption = interaction.options.get('reason');
    const reason = (reasonOption?.value as string) || undefined;

    if (!member) {
      await interaction.reply('No such user found.');
      return;
    }
    if (!member.manageable) {
      await interaction.reply('Unable to act upon the user.');
      return;
    }

    const actionOption = interaction.options.get('action');
    const action = actionOption?.value as string;

    switch (action) {
      case 'ban':
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) {
          await interaction.reply('Insufficent permissions.');
          return;
        }
        interaction.guild?.members.ban(member, { reason: reason });
        await interaction.reply(`Successfully banned <@${member.user.id}>`);
        return;

      case 'kick':
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.KickMembers)) {
          await interaction.reply('Insufficent permissions.');
          return;
        }
        interaction.guild?.members.kick(member, reason);
        await interaction.reply(`Successfully kicked <@${member.user.id}>`);
        return;

      default:
        await interaction.reply('Mod action failed.');
        return;
    }
  },
};

export default Mod;
