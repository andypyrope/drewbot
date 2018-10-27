import { CommandHandler } from "../command-handler";
import { CommandParams } from "../command-params";

export class HelpCommand implements CommandHandler {

   constructor(private readonly commands: CommandHandler[]) { }

   getAliases(): string[] {
      return ["help"];
   }

   getInfo(): string {
      return "Shows information about all commands";
   }

   execute(params: CommandParams): void {
      params.bot.sendMessage({
         to: params.channelId,
         message: "Commands:\n" + this.commands
            .map((command: CommandHandler) =>
               " • " + command.getAliases().map((alias: string) => "`" + alias + "`").join(" | ") +
               " -- " + command.getInfo())
            .join("\n"),
      });
   }
}
