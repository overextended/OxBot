import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces/command';

const choices = ['rock', 'paper', 'scissors'];

function determineWinner(userChoice: string, botChoice: string): string {
  if (userChoice === botChoice) {
    return "It's a tie!";
  }

  const winsAgainst: { [key: string]: string } = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };

  if (winsAgainst[userChoice] === botChoice) {
    return 'You win!';
  } else {
    return 'You lose!';
  }
}

const RockPaperScissors: Command = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock Paper Scissors with the bot')
    .addStringOption((option) =>
      option
        .setName('choice')
        .setDescription('Your choice: rock, paper, or scissors')
        .setRequired(true)
        .addChoices(...choices.map((choice) => ({ name: choice, value: choice })))
    ),
  async run(interaction: CommandInteraction) {
    const userChoice = interaction.options.get('choice', true)?.value as string;
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    const result = determineWinner(userChoice, botChoice);

    await interaction.reply(`You chose ${userChoice}, and the bot chose ${botChoice}. ${result}`);
  },
};

export default RockPaperScissors;
