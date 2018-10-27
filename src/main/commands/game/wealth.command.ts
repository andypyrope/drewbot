import { CommandHandler } from "../command-handler";
import { CommandParams } from "../command-params";

export class WealthCommand implements CommandHandler {

   getAliases(): string[] {
      return ["wealth"];
   }

   getInfo(): string {
      return "Shows the current amount of wealth you have";
   }

   async execute(params: CommandParams): Promise<void> {
      const tokens: number = await params.database.fetchTokens(params.authorId);
      params.bot.sendMessage({
         to: params.channelId,
         message: "<@" + params.authorId + ">, you have " + tokens + " token" + (tokens === 1 ? "" : "s") + ".",
      });
   }
}
