import { CommandHandler } from "../command-handler";
import { CommandParams } from "../command-params";

export class EmptyCommand implements CommandHandler {

   getAliases(): string[] {
      return [""];
   }

   getInfo(): string {
      return "Only replies with an emoji";
   }

   execute(params: CommandParams): void {
      params.bot.sendMessage({
         to: params.channelId,
         message: "(* >ω<)!",
      });
   }
}
