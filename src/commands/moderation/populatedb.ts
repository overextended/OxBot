import { ChatInputCommandInteraction, Guild, GuildMember, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../interfaces/command';
import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

const BATCH_SIZE = 100;
const DELAY_BETWEEN_BATCHES = 5000;
const DELAY_BETWEEN_USERS = 100;

async function processUserBatch(members: GuildMember[], interaction: ChatInputCommandInteraction) {
  let processed = 0;

  for (const member of members) {
    try {
      await prisma.user.upsert({
        where: { id: member.id },
        create: {
          id: member.id,
          warns: 0,
          timeouts: 0,
          messageCount: 0,
          joinedAt: member.joinedAt || new Date(),
          riskScore: 0,
          lastScan: null,
        },
        update: {},
      });

      processed++;

      if (processed % 10 === 0) {
        await interaction.editReply({
          content: `Processing batch: ${processed}/${members.length} users in current batch`,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_USERS));
    } catch (error) {
      logger.error(`Error processing user ${member.id}:`, error);
    }
  }

  return processed;
}

const PopulateDB: Command = {
  data: new SlashCommandBuilder()
    .setName('populatedb')
    .setDescription('Populate database with all guild members (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async run(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const guild = interaction.guild;
      let members = await guild.members.fetch();
      const totalMembers = members.size;

      logger.info(`Starting database population for ${totalMembers} members`);
      await interaction.editReply(`Starting database population for ${totalMembers} members...`);

      let processedTotal = 0;
      const memberArray = Array.from(members.values());

      for (let i = 0; i < memberArray.length; i += BATCH_SIZE) {
        const batch = memberArray.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(memberArray.length / BATCH_SIZE);

        await interaction.editReply({
          content: `Processing batch ${batchNumber}/${totalBatches}\nTotal progress: ${processedTotal}/${totalMembers} members`,
        });

        const processed = await processUserBatch(batch, interaction);
        processedTotal += processed;

        if (i + BATCH_SIZE < memberArray.length) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }

      await interaction.editReply({
        content: `Database population complete!\nProcessed ${processedTotal}/${totalMembers} members successfully.`,
      });

      logger.info(`Database population complete. Processed ${processedTotal}/${totalMembers} members`);
    } catch (error) {
      logger.error('Error in populatedb command:', error);
      await interaction.editReply('An error occurred while populating the database.');
    }
  },
};

export default PopulateDB;
