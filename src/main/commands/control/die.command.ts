import * as Discord from "discord.io";
import { CommandHandler } from "../command-handler";
import { MessageCreateEvent } from "../../events/event-types/message-create.event";
import { TimeParser } from "../../util/time-parser";
import * as logger from "winston";

export class DieCommand implements CommandHandler {
   getCommands(): string[] {
      return ["die", "perish", "self-destruct", "kys"];
   }

   getInfo(): string {
      return "Shuts the bot down properly";
   }

   execute(bot: Discord.Client, args: string[], channelID: string, event: MessageCreateEvent): void {
      if (event.author.id !== "258312787422347264") {
         bot.sendMessage({
            to: channelID,
            message: "How dare you... :shiba-heartbroken:",
         });
         return;
      }

      logger.info("Disconnecting...");

      if (args[0]) {
         const delay: number = new TimeParser(args[0]).getAsMs();
         if (isNaN(delay) || delay < 0) {
            return;
         }
         setTimeout((): void => {
            bot.disconnect();
         }, delay);
      } else {
         bot.disconnect();
      }
   }
}
