import { CommandHandler } from "../command-handler";
import * as Discord from "discord.io";

export class EmptyCommand implements CommandHandler {
   getCommands(): string[] {
      return [""];
   }

   getInfo(): string {
      return "Only replies with an emoji";
   }

   execute(bot: Discord.Client, args: string[], channelId: string): void {
      bot.sendMessage({
         to: channelId,
         message: "(* >ω<)!",
      });
   }
}
