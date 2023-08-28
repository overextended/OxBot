import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command';
import { prisma } from '../prismaClient';

const Warns: Command = {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Fetch a users warns')
    .addStringOption((option) =>
      option.setName('user').setDescription('User ID to fetch warns for.').setRequired(true)
    ),
  async run(interaction: CommandInteraction) {
    console.log(interaction.options.get('user', true).value);

    if (!interaction.memberPermissions?.has('MuteMembers')) {
      await interaction.reply({ content: 'Insufficent permissions' });
      return;
    }

    const warns = await prisma.warns.findMany({
      where: {
        targetId: interaction.options.get('user', true).value as string,
      },
    });

    await interaction.reply({ content: JSON.stringify(warns, null, 2) });
  },
};

export default Warns;
