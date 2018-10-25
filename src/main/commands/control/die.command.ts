import * as logger from "winston";
import { TimeParser } from "../../util/time-parser";
import { CommandHandler } from "../command-handler";
import { CommandParams } from "../command-params";

export class DieCommand implements CommandHandler {
   getAliases(): string[] {
      return ["die", "perish", "self-destruct", "kys"];
   }

   getInfo(): string {
      return "Shuts the bot down properly";
   }

   execute(params: CommandParams): void {
      if (params.authorId !== "258312787422347264") {
         params.bot.sendMessage({
            to: params.channelId,
            message: "How dare you... :shiba-heartbroken:",
         });
         return;
      }

      logger.info("Disconnecting...");

      if (params.parts[1]) {
         const delay: number = new TimeParser(params.parts[1]).getAsMs();
         if (isNaN(delay) || delay < 0) {
            return;
         }
         setTimeout((): void => {
            params.bot.disconnect();
         }, delay);
      } else {
         params.bot.disconnect();
      }
   }
}