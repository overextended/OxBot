import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/command';

const responses = [
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes - definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  "Don't count on it.",
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.',
];

const Magic8Ball: Command = {
  data: new SlashCommandBuilder()
    .setName('magic8ball')
    .setDescription('Ask a question and let the magic 8-ball guide you')
    .addStringOption((option) =>
      option.setName('question').setDescription('Your question for the magic 8-ball').setRequired(true)
    ),
  async run(interaction: CommandInteraction) {
    const questionOption = interaction.options.get('question', true);
    const question = questionOption.value;
    const answer = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply(`🎱 *Question:* ${question}\n🔮 *Answer:* ${answer}`);
  },
};

export default Magic8Ball;
