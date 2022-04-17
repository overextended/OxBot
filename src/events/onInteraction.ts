import { Interaction } from "discord.js";
import { CommandList } from "../commands";

export const onInteraction = async (interaction: Interaction) => {
    if (!interaction.isCommand()) return
    for (const Command of CommandList) {
      if (interaction.commandName === Command.data.name) {
        await Command.run(interaction);
        break;
      }
    }
};