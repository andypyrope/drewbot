import { CommandHandler } from "../command-handler";
import { CommandParams } from "../command-params";

export class GetTokenCommand implements CommandHandler {

   getAliases(): string[] {
      return ["get-token"];
   }

   getInfo(): string {
      return "Gives you a single token";
   }

   async execute(params: CommandParams): Promise<void> {
      const newTokens: number = await params.database.giveTokens(params.authorId, 1);
      params.bot.sendMessage({
         to: params.channelId,
         message: "(* >ω<) Done! Now you have " + newTokens + " token" + (newTokens === 1 ? "" : "s") + ".",
      });
   }
}
