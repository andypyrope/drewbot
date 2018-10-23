import { CommandParams } from "./command-params";

export interface CommandHandler {
   getAliases(): string[];

   getInfo(): string;

   execute(params: CommandParams): void;
}
