import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from 'discord.js';
import { Command } from '../interfaces/command';
import { prisma } from '../prismaClient';

const Warn: Command = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user for being naughty')
    .addUserOption((option) => option.setName('user').setDescription('User to issue the warning to.').setRequired(true))
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason for issuing the warn.').setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName('silent')
        .setDescription('Whether or not to if the bot should announce the warning.')
        .setRequired(false)
    ),
  async run(interaction: CommandInteraction) {
    console.log(interaction.options.get('user', true).value);

    if (!interaction.memberPermissions?.has('MuteMembers')) {
      await interaction.reply({ content: 'Insufficent permissions' });
      return;
    }

    const target = interaction.options.getUser('user', true);

    if (!target) {
      await interaction.reply({ content: 'No such user found.' });
      return;
    }

    const reason = interaction.options.get('reason', true).value as string;

    try {
      await prisma.warns.create({
        data: {
          targetId: target.id,
          issuedAt: new Date(),
          issuerId: interaction.user.id,
          reason,
        },
      });
    } catch (e) {
      console.log('Failed to insert new row in database.');
    }

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('User has been warned')
      .setDescription(`<@${target.id}> has been warned for: \`${reason}\`.`)
      .setAuthor({
        name: (interaction.user.username || 'Unknown Username').substring(0, 256),
        iconURL: interaction.user.displayAvatarURL(),
      });

    if (interaction.options.get('silent', false)?.value) {
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // TODO: timeouts scaling with number of warns

    await interaction.reply({ embeds: [embed] });
  },
};

export default Warn;
