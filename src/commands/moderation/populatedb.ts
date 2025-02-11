import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { Command } from '../../interfaces/command';
import { PrismaClient } from '@prisma/client';
import logger from '../../utils/logger';

const prisma = new PrismaClient();

const BATCH_SIZE = 100;
const DELAY_BETWEEN_BATCHES = 5000;
const DELAY_BETWEEN_USERS = 100;

interface ProcessResult {
  success: number;
  failed: number;
  errors: string[];
}

async function processUserBatch(
  members: GuildMember[],
  interaction: ChatInputCommandInteraction
): Promise<ProcessResult> {
  const result: ProcessResult = {
    success: 0,
    failed: 0,
    errors: [],
  };

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

      result.success++;

      if (result.success % 10 === 0) {
        await interaction
          .editReply({
            content:
              `Processing batch: ${result.success + result.failed}/${members.length} users\n` +
              `Success: ${result.success} | Failed: ${result.failed}`,
          })
          .catch((err) => {
            logger.error('Failed to update progress:', err);
          });
      }

      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_USERS));
    } catch (error) {
      result.failed++;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`Failed to process user ${member.id}: ${errorMessage}`);
      logger.error(`Error processing user ${member.id}:`, error);
    }
  }

  return result;
}

const PopulateDB: Command = {
  data: new SlashCommandBuilder()
    .setName('populatedb')
    .setDescription('Populate database with all guild members (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async run(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply({
        content: 'This command can only be used in a guild.',
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      let members;

      try {
        members = await interaction.guild.members.fetch();
      } catch (error) {
        logger.error('Failed to fetch guild members:', error);
        await interaction.editReply('Failed to fetch guild members. Please try again.');
        return;
      }

      const totalMembers = members.size;

      logger.info(`Starting database population for ${totalMembers} members`);
      await interaction.editReply(`Starting database population for ${totalMembers} members...`);

      let totalSuccess = 0;
      let totalFailed = 0;
      const allErrors: string[] = [];
      const memberArray = Array.from(members.values());

      for (let i = 0; i < memberArray.length; i += BATCH_SIZE) {
        const batch = memberArray.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(memberArray.length / BATCH_SIZE);

        try {
          await interaction.editReply({
            content:
              `Processing batch ${batchNumber}/${totalBatches}\n` +
              `Total progress: ${i}/${totalMembers} members\n` +
              `Success: ${totalSuccess} | Failed: ${totalFailed}`,
          });

          const batchResult = await processUserBatch(batch, interaction);

          totalSuccess += batchResult.success;
          totalFailed += batchResult.failed;
          allErrors.push(...batchResult.errors);

          if (i + BATCH_SIZE < memberArray.length) {
            await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
          }
        } catch (error) {
          logger.error(`Error processing batch ${batchNumber}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          allErrors.push(`Batch ${batchNumber} failed: ${errorMessage}`);
        }
      }

      const finalMessage =
        `Database population complete!\n` +
        `Total processed: ${totalSuccess + totalFailed}/${totalMembers}\n` +
        `Successful: ${totalSuccess}\n` +
        `Failed: ${totalFailed}`;

      // Log errors if any
      if (allErrors.length > 0) {
        const errorLog =
          allErrors.slice(0, 10).join('\n') +
          (allErrors.length > 10 ? `\n...and ${allErrors.length - 10} more errors` : '');
        logger.error('Population errors:', errorLog);
      }

      await interaction.editReply(finalMessage);
      logger.info(`Database population complete. Success: ${totalSuccess}, Failed: ${totalFailed}`);
    } catch (error) {
      logger.error('Error in populatedb command:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      if (interaction.deferred) {
        await interaction.editReply(`An error occurred while populating the database: ${errorMessage}`);
      } else {
        await interaction.reply({
          content: `An error occurred while populating the database: ${errorMessage}`,
          ephemeral: true,
        });
      }
    }
  },
};

export default PopulateDB;
