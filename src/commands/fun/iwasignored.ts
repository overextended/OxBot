import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/command';
import { getStat } from '../../handlers/stats';

const IWasIgnored: Command = {
    data: new SlashCommandBuilder()
        .setName('ignored')
        .setDescription('How many times have I been ignored ?'),
    run: async (interaction: CommandInteraction) => {
        
        const embed = new EmbedBuilder()
            .setTitle('I\'ve been ignored...')
            .setDescription(
                `Since I've been able to count, I have had to remind people:\n` +
                `- ${getStat('ignored_guidelines')} times about the support guidelines,\n` +
                `- ${getStat('resource_questions')} to read the documentation before asking questions.`
            )
            .setThumbnail(interaction.client.user.displayAvatarURL({ size: 128, extension: 'webp'}))
            .setColor('#26e0a5');

        await interaction.reply({embeds: [embed]});
    },
};

export default IWasIgnored;
