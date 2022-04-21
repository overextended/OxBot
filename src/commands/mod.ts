import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember } from 'discord.js';
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
  run: async (interaction) => {
    const member = interaction.options.getMember('user', true) as GuildMember;
    const reason = interaction.options.getString('reason') || undefined;
    if (!member) return interaction.reply('No such user found.');
    if (!member.manageable) return interaction.reply('Unable to act upon the user.');
    switch (interaction.options.getString('action', true)) {
      case 'ban':
        if (!interaction.memberPermissions?.has('BAN_MEMBERS')) return interaction.reply('Insufficent permissions.');
        interaction.guild?.members.ban(member, { reason: reason });
        return await interaction.reply(`Successfully banned <@${member.user.id}>`);
      case 'kick':
        if (!interaction.memberPermissions?.has('KICK_MEMBERS')) return interaction.reply('Insufficent permissions.');
        interaction.guild?.members.kick(member, reason);
        return await interaction.reply(`Successfully kicked <@${member.user.id}>`);
      default:
        return await interaction.reply('Mod action failed.');
    }
  },
};

export default Mod;
