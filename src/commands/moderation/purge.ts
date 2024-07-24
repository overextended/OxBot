import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js';
import { Command } from '../../interfaces/command';
import logger from '../../utils/logger';

const Purge: Command = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes messages in the current channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('any')
        .setDescription('Delete any X amount of messages')
        .addIntegerOption((option) =>
          option.setName('count').setDescription('Number of messages to delete').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription('Delete X amount of messages from a specific user')
        .addUserOption((option) => option.setName('user').setDescription('The user').setRequired(true))
        .addIntegerOption((option) =>
          option.setName('count').setDescription('Number of messages to delete').setRequired(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName('after')
        .setDescription('Delete messages after a specific message ID')
        .addStringOption((option) =>
          option.setName('messageid').setDescription('The ID of the message to start deleting after').setRequired(true)
        )
        .addIntegerOption((option) =>
          option.setName('count').setDescription('Number of messages to delete').setRequired(false)
        )
    ),

  async run(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const count = interaction.options.getInteger('count');

    if (!(interaction.channel instanceof TextChannel)) {
      await interaction.reply({ content: 'This command can only be used in text channels.', ephemeral: true });
      return;
    }

    if (subcommand === 'any') {
      try {
        const messages = await interaction.channel.messages.fetch({ limit: count ?? undefined });
        await interaction.channel.bulkDelete(messages, true);
        await interaction.reply({ content: `Successfully deleted ${messages.size} messages.`, ephemeral: true });
      } catch (error) {
        logger.error(error);
        await interaction.reply({ content: 'An error occurred while deleting messages.', ephemeral: true });
      }
    } else if (subcommand === 'user') {
      const user = interaction.options.getUser('user', true);
      try {
        const allMessages = await interaction.channel.messages.fetch({ limit: 100 });
        const userMessages = allMessages.filter((msg) => msg.author.id === user.id);

        const messagesToDelete = userMessages.first(count ?? 0);
        const deletedMessages = await interaction.channel.bulkDelete(messagesToDelete, true);

        await interaction.reply({
          content: `Successfully deleted ${deletedMessages.size} messages from ${user.tag}.`,
          ephemeral: true,
        });
      } catch (error) {
        logger.error(error);
        await interaction.reply({
          content: 'An error occurred while deleting messages.',
          ephemeral: true,
        });
      }
    }

    if (subcommand === 'after') {
      const messageIdOption = interaction.options.getString('messageid');
      const countOption = interaction.options.getInteger('count');

      if (!messageIdOption) {
        await interaction.reply({ content: 'Invalid message ID.', ephemeral: true });
        return;
      }

      const messageId = messageIdOption;
      const count = countOption || 1;

      try {
        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        const messagesArray = Array.from(messages.values());
        const startIndex = messagesArray.findIndex((m) => m.id === messageId);

        if (startIndex === -1) {
          await interaction.reply({ content: 'Message ID not found in the last 100 messages.', ephemeral: true });
          return;
        }

        const messagesAfterSpecified = messagesArray.slice(0, startIndex).reverse();
        const messagesToDelete =
          messagesAfterSpecified.length > count ? messagesAfterSpecified.slice(0, count) : messagesAfterSpecified;

        await interaction.channel.bulkDelete(messagesToDelete, true);
        await interaction.reply({
          content: `Successfully deleted ${messagesToDelete.length} messages after the specified message.`,
          ephemeral: true,
        });
      } catch (error) {
        logger.error(error);
        await interaction.reply({ content: 'An error occurred while deleting messages.', ephemeral: true });
      }
    }
  },
};

export default Purge;
