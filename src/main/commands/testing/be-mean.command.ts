import { CommandHandler } from "../command-handler";
import * as Discord from "discord.io";
import { MessageCreateEvent } from "../../events/event-types/message-create.event";

export class BeMeanCommand implements CommandHandler {
   getCommands(): string[] {
      return ["be-mean"];
   }

   getInfo(): string {
      return "Tries to slap the user";
   }

   execute(bot: Discord.Client, args: string[], channelID: string, event: MessageCreateEvent): void {
      bot.sendMessage({
         to: channelID,
         message: "~slap <@" + event.author.id + ">",
         typing: true,
      });
   }
}
