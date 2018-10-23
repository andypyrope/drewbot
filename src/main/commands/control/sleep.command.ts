import * as logger from "winston";
import { TimeParser } from "../../util/time-parser";
import { CommandHandler } from "../command-handler";
import { CommandParams } from "../command-params";

export class SleepCommand implements CommandHandler {
   getAliases(): string[] {
      return ["sleep"];
   }

   getInfo(): string {
      return "Puts the bot to sleep for some amount of time";
   }

   execute(params: CommandParams): void {
      if (params.authorId !== "258312787422347264") {
         params.bot.sendMessage({
            to: params.channelId,
            message: "Not until you've read me a bedtime story, hmph (￣^￣)",
         });
         return;
      }

      if (!params.parts[0]) {
         logger.error("The 'sleep' command requires a parameter!");
         return;
      }
      const delay: number = new TimeParser(params.parts[1]).getAsMs();
      if (isNaN(delay) || delay < 0) {
         return;
      }
      params.bot.disconnect();
      const subDelay: number = Math.max(delay / 30, 200);
      const beginningTime: number = new Date().getTime();
      const endTime: number = beginningTime + delay;
      const intervalId: NodeJS.Timeout = setInterval((): void => {
         const currentTime: number = new Date().getTime();
         const percentage: number = Math.round((currentTime - beginningTime) * 100.0 / delay);
         let percentageString: string = "";
         let percentageLeft: number = percentage;
         for (let i: number = 0; i < 10; i++) {
            if (percentageLeft >= 8) {
               percentageString += "■";
            } else if (percentageLeft >= 3) {
               percentageString += "▣";
            } else {
               percentageString += "□";
            }
            percentageLeft -= 10;
         }
         const secondsLeft: number = Math.round((endTime - currentTime) / 1000);
         logger.info(percentageString + " -- Waking up in " + secondsLeft + " second" + (secondsLeft === 1 ? "" : "s") + " (" + percentage + "%)");
      }, subDelay);
      setTimeout((): void => {
         clearInterval(intervalId);
         if (!params.bot.connected) {
            params.bot.connect();
         } else {
            logger.error("The bot is already connected but it should be disconnected!");
         }
      }, delay);
   }
}
