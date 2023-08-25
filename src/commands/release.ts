import { Command } from '../interfaces/command';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

const Release: Command = {
  data: new SlashCommandBuilder().setName('release').setDescription('Download release instead of source code'),
  run: async (interaction) => {
    await interaction.reply({ embeds: [releaseEmbed()] });
  },
};

function releaseEmbed(): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle('Release zip')
    .setDescription(
      'If you are getting a no such export error, or an error saying that the UI needs to be built, please ensure you downloaded a release zip instead of the source code.'
    )
    .setColor('#ff0000')
    .addFields(
      {
        name: 'Source code',
        value: `Pressing the green code button and then pressing *Download ZIP* or cloning the repository with Git will download the source code.
        
        Source code needs to be built/compiled, you can do this yourself or alternately the recommended way is downloading the release zip we provide.`,
      },
      {
        name: 'Where to download the release zip',
        value: `The release zip can be found in the *Releases* section on the GitHub repository to the right side.
      
      Make sure **not** to download the one that says *Source code*.`,
      },
      {
        name: 'Building the source code',
        value: `Alternately instead of downloading the release zip you can build/compile the source code yourself.
       
       This is **not** recommended unless you know what you are doing.`,
      }
    );

  return embed;
}

export default Release;
