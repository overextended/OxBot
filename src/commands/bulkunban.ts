import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../interfaces/command';

const BulkUnban: Command = {
  data: new SlashCommandBuilder()
    .setName('bulkunban')
    .setDescription('Unban all people with the reason included')
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('The reason to check for, this checks if the provided string is included in the reason')
        .setRequired(true)
    ),
  run: async (interaction) => {
    if (!interaction.guild) return interaction.reply('This command can only be run in a guild.');
    if (!interaction.memberPermissions?.has('BAN_MEMBERS')) return interaction.reply('Insufficent permissions.');

    const reason = interaction.options.getString('reason', true);
    let amount = 0;
    interaction.guild.bans.cache.forEach((ban) => {
      if (!ban.reason || !ban.reason.includes(reason)) return;
      interaction.guild?.members.unban(ban.user.id);
      amount++;
    });

    interaction.reply(`Successfully unbanned ${amount} users.`);
  },
};

export default BulkUnban;
