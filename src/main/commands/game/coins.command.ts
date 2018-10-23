import { CommandHandler } from "../command-handler";
import { CommandParams } from "../command-params";

export class CoinsCommand implements CommandHandler {
   getCommands(): string[] {
      return ["coins"];
   }

   getInfo(): string {
      return "Shows the current number of coins you have";
   }

   execute(params: CommandParams): void {
      params.bot.sendMessage({
         to: params.channelId,
         message: "(* >ω<)!",
      });
   }
}
