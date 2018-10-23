import { CommandParams } from "./command-params";

export interface CommandHandler {
   getInfo(): string;

   getCommands(): string[];

   execute(params: CommandParams): void;
}
