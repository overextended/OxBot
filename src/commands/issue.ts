import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../interfaces/command';

const issue: Command = {
    data: new SlashCommandBuilder()
        .setName('issue')
        .setDescription('Get the issue link for a specific repository.')
        .addStringOption(option => 
            option.setName('repository')
                  .setDescription('Select the repository')
                  .setRequired(true)
                  .addChoices(
                    { name: 'ox_lib', value: 'ox_lib' },
                    { name: 'ox_inventory', value: 'ox_inventory' },
                    { name: 'oxmysql', value: 'oxmysql' },
                    { name: 'ox_core', value: 'ox_core' },
                    { name: 'ox_fuel', value: 'ox_fuel' },
                    { name: 'ox_target', value: 'ox_target' },
                    { name: 'ox_doorlock', value: 'ox_doorlock' }
                    )
        ),
    run: async (interaction: CommandInteraction) => {
        const repo = interaction.options.getString('repository');

        const repoLinks: { [key: string]: string } = {
            'ox_lib': 'https://github.com/overextended/ox_lib/issues',
            'ox_inventory': 'https://github.com/overextended/ox_inventory/issues',
            'oxmysql': 'https://github.com/overextended/oxmysql/issues',
            'ox_core': 'https://github.com/overextended/ox_core/issues',
            'ox_fuel': 'https://github.com/overextended/ox_fuel/issues',
            'ox_target': 'https://github.com/overextended/ox_target/issues',
            'ox_doorlock': 'https://github.com/overextended/ox_doorlock/issues'
        };

        const link = repoLinks[repo as string] || 'Unknown repository';

        await interaction.reply(`Issue link for ${repo}: ${link}`);
    }
};

export default issue;
