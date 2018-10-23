import { CommandHandler } from "../command-handler";
import * as Discord from "discord.io";
import { MessageCreateEvent } from "../../events/event-types/message-create.event";

export class CoinsCommand implements CommandHandler {
   getCommands(): string[] {
      return ["coins"];
   }

   getInfo(): string {
      return "Only replies with an emoji";
   }

   execute(bot: Discord.Client, args: string[], channelID: string, event: MessageCreateEvent): void {
      bot.sendMessage({
         to: channelID,
         message: "(* >ω<)!",
      });
   }
}
