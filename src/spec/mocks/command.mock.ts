import { CommandHandler } from "../../main/commands/command-handler";
import { CommandParams } from "../../main/commands/command-params";

export class CommandMock implements CommandHandler {

   constructor(private readonly aliases: string[], private readonly info: string) { }

   getAliases(): string[] {
      return this.aliases;
   }

   getInfo(): string {
      return this.info;
   }

   execute(params: CommandParams): void {
      throw new Error("execute should be spied upon");
   }
}
