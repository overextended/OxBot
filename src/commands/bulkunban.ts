import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../interfaces/command';

const BulkUnban: Command = {
  data: new SlashCommandBuilder()
    .setName('bulkunban')
    .setDescription('Unban all people with the reason included')
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('The reason to check for, this checks if the provided string is included in the reason')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply('This command can only be run in a guild.');
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) {
      await interaction.reply('Insufficient permissions.');
      return;
    }

    const reasonOptionRaw = interaction.options.get('reason')?.value;
    const reasonOption = typeof reasonOptionRaw === 'string' ? reasonOptionRaw : 'No reason provided';

    let amount = 0;

    try {
      const bans = await interaction.guild.bans.fetch();
      console.log(`Total bans found: ${bans.size}`); // <-- Log total number of bans

      const unbans = bans.filter((ban) => ban.reason && ban.reason.toLowerCase().includes(reasonOption.toLowerCase()));
      console.log(`Matching bans found: ${unbans.size}`); // <-- Log matched bans

      for (const ban of unbans.values()) {
        console.log(`Attempting to unban: ${ban.user.tag} - Reason: ${ban.reason}`); // <-- Log each user being unbanned
        await interaction.guild.bans.remove(ban.user, `Used /bulkunban for reason: ${reasonOption}`);
        amount++;
      }

      await interaction.reply(`Successfully unbanned ${amount} users.`);
    } catch (e) {
      await interaction.reply('An error occurred while processing the unbans.');
      console.error(e);
    }
  },
};

export default BulkUnban;
