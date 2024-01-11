import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../interfaces/command';

const Whois: Command = {
  data: new SlashCommandBuilder()
    .setName('whois')
    .setDescription('Displays information about a user')
    .addUserOption((option) =>
      option.setName('user').setDescription('The user to get information about').setRequired(true)
    ),

  async run(interaction: CommandInteraction) {
    const userOption = interaction.options.getUser('user', true);
    const member = await interaction.guild?.members.fetch(userOption.id);

    if (!member) {
      await interaction.reply({ content: 'User not found in this guild.', ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Information for ${userOption.username}`)
      .setColor(0x000000)
      .setThumbnail(userOption.displayAvatarURL())
      .addFields(
        { name: 'Account Created', value: formatDate(userOption.createdAt), inline: true },
        { name: 'Account Age', value: formatDuration(new Date(), userOption.createdAt), inline: true },
        { name: 'Joined Server At', value: formatDate(member.joinedAt), inline: true },
        { name: 'Joined Server Age', value: formatDuration(new Date(), member.joinedAt), inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'User information', iconURL: interaction.client.user?.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  },
};

function formatDate(date: Date | null): string {
  if (!date) {
    return 'Unknown';
  }
  return `${date.getUTCDate().toString().padStart(2, '0')} ${date.toLocaleString('default', {
    month: 'short',
  })} ${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, '0')}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')} UTC`;
}

function formatDuration(currentDate: Date, pastDate: Date | null): string {
  if (!pastDate) {
    return 'Unknown';
  }
  let delta = Math.floor((currentDate.getTime() - pastDate.getTime()) / 1000);

  const years = Math.floor(delta / 31536000);
  delta -= years * 31536000;
  const weeks = Math.floor(delta / 604800);
  delta -= weeks * 604800;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600);

  return `${years} years ${weeks} weeks ${days} days and ${hours} hours`;
}

export default Whois;
