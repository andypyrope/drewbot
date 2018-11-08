import * as logger from "winston";
import { Bot } from "../bot/bot";
import { Database } from "../db/database";
import { EventHandler } from "../events/event-handler";
import { MessageCreateEvent } from "../events/event-types/message-create.event";
import { CommandHandler } from "./command-handler";
import { GetTokenCommand } from "./game/get-token.command";
import { WealthCommand } from "./game/wealth.command";
import { HelpCommand } from "./general/help.command";

export class CommandRegistry {
   private readonly commandHandlers: { [cmd: string]: CommandHandler } = {};

   constructor(private readonly bot: Bot, private readonly database: Database,
      private readonly eventHandler: EventHandler, private readonly commandPrefix: string) {

      const handlerList: CommandHandler[] = [
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

      eventHandler.messageCreate.listen((event: MessageCreateEvent) => {
         this.scanMessage(event);
      });
   }

   private scanMessage(event: MessageCreateEvent): void {

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
         eventHandler: this.eventHandler,
      }).then(() => {
         logger.info(`Command ${command}, executed by user '${event.author.username}' has succeeded.`);
      }).catch((error?: Error) => {
         logger.error(`Command ${command}, executed by user '${event.author.username}' has failed due to : ${error ? error.message : "No error provider"}`);
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
