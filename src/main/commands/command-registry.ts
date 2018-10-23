import { MessageCreateEvent } from "../events/event-types/message-create.event";
import * as logger from "winston";
import * as Discord from "discord.io";
import { CommandHandler } from "./command-handler";
import { EmptyCommand } from "./testing/empty.command";
import { DieCommand } from "./control/die.command";
import { SleepCommand } from "./control/sleep.command";
import { BeMeanCommand } from "./testing/be-mean.command";

export class CommandRegistry {
   private readonly commandHandlers: {[cmd: string]: CommandHandler} = {};

   constructor(private readonly bot: Discord.Client, private readonly commandPrefix: string) {
      const handlerList: CommandHandler[] = [
         new DieCommand(),
         new SleepCommand(),
         new BeMeanCommand(),
         new EmptyCommand(),
      ];

      for (const handler of handlerList) {
         for (const command of handler.getCommands()) {
            this.handleCommand(command, handler);
         }
      }
   }

   scanMessage(event: MessageCreateEvent): void {
      logger.debug("Message '" + event.content + "' has been sent by user " + event.author.username + "#" + event.author.discriminator +
         " at channel with ID '" + event.channel_id + "'");

      const channelId: string = event.channel_id;

      // Ignore messgaes not directed to this bot
      if (!event.content.startsWith(this.commandPrefix)) {
         return;
      }
      const parts: string[] = event.content.replace(this.commandPrefix, "").trim().split(" ");
      const command: string = parts[0];

      logger.info("Command '" + command + "' with arguments [" +
         parts.slice(1).map((part: string): string => "'" + part + "'").join(", ") +
         "] has been executed by user " + event.author.username + "#" + event.author.discriminator + " at channel with ID '" + event.channel_id + "'");

      if (!this.commandHandlers[command]) {
         logger.error("There is no handler for command '" + command + "'");
         return;
      }

      this.commandHandlers[command].execute(this.bot, parts.slice(1), channelId, event);
   }

   private handleCommand(command: string, handler: CommandHandler): void {
      if (this.commandHandlers[command]) {
         logger.warn("Command '" + command + "' already has a command handler. Cannot assign another one to it");
         return;
      }
      this.commandHandlers[command] = handler;
   }
}
