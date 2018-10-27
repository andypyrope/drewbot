import * as Discord from "discord.io";
import * as logger from "winston";
import { TypeormDatabase } from "../db/typeorm-database";
import { EventHandler } from "../events/event-handler";
import { MessageCreateEvent } from "../events/event-types/message-create.event";
import { CommandHandler } from "./command-handler";
import { DieCommand } from "./control/die.command";
import { SleepCommand } from "./control/sleep.command";
import { GetTokenCommand } from "./game/get-token.command";
import { WealthCommand } from "./game/wealth.command";
import { HelpCommand } from "./general/help.command";

export class CommandRegistry {
   private readonly commandHandlers: { [cmd: string]: CommandHandler } = {};

   constructor(private readonly bot: Discord.Client, private readonly database: TypeormDatabase,
      private readonly commandPrefix: string) {

      const handlerList: CommandHandler[] = [
         // control
         new DieCommand(),
         new SleepCommand(),
         // game
         new GetTokenCommand(),
         new WealthCommand(),
      ];
      // general
      handlerList.push(new HelpCommand(handlerList));

      for (const handler of handlerList) {
         for (const command of handler.getAliases()) {
            this.handleCommand(command, handler);
         }
      }
   }

   scanMessage(event: MessageCreateEvent, eventHandler: EventHandler): void {

      logger.debug("Message '" + event.content + "' has been sent by user " + event.author.username +
         "#" + event.author.discriminator + " at channel with ID '" + event.channel_id + "'");

      const channelId: string = event.channel_id;

      // Ignore messgaes not directed to this bot
      if (!event.content.startsWith(this.commandPrefix)) {
         return;
      }
      const parts: string[] = event.content.replace(this.commandPrefix, "").trim().split(" ");
      const command: string = parts[0];

      logger.info("Command '" + command + "' has been executed by user " + event.author.username +
         "#" + event.author.discriminator + " at channel with ID '" + event.channel_id + "'");

      if (!this.commandHandlers[command]) {
         logger.error("There is no handler for command '" + command + "'");
         return;
      }

      this.commandHandlers[command].execute({
         bot: this.bot,
         database: this.database,
         authorId: event.author.id,
         command: command,
         channelId: channelId,
         event: event,
         parts: parts,
         eventHandler: eventHandler,
      });
   }

   private handleCommand(command: string, handler: CommandHandler): void {
      if (this.commandHandlers[command]) {
         logger.warn("Command '" + command + "' already has a command handler. Cannot assign another one to it");
         return;
      }
      this.commandHandlers[command] = handler;
   }
}
