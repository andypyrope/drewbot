import * as Discord from "discord.io";
import * as fs from "fs";
import { TransformableInfo } from "logform";
import "reflect-metadata";
import * as logger from "winston";
import { CommandRegistry } from "./commands/command-registry";
import { TypeormDatabase } from "./db/typeorm-database";
import { EventHandler } from "./events/event-handler";
import { DisconnectEvent } from "./events/event-types/disconnect.event";
import { MessageCreateEvent } from "./events/event-types/message-create.event";

const auth: any = JSON.parse(fs.readFileSync("auth.json", "utf8"));

const opts: any = { colorize: true };

logger.configure({
   level: "silly",
   transports: [
      new logger.transports.Console(opts)
   ],
   format: logger.format.combine(
      logger.format.colorize(),
      logger.format.timestamp(),
      logger.format.printf((info: TransformableInfo) => {
         return `${info.timestamp} [${info.level}] ${info.message}`;
      })
   ),
});

async function main(): Promise<void> {
   const database: TypeormDatabase = await TypeormDatabase.initialize();

   // Initialize Discord Bot
   logger.info("Initializing the bot...");
   const bot: Discord.Client = new Discord.Client({
      token: auth.token,
      autorun: true
   });

   const eventHandler: EventHandler = new EventHandler(bot);
   const channelToServer: { [channelId: string]: Discord.Server } = {};

   eventHandler.ready.listen((): void => {
      logger.info("Connected");
      logger.info("Logged in as: ");
      logger.info(bot.username + " - (" + bot.id + ")");
      for (const serverId in bot.servers) {
         for (const channelId in bot.servers[serverId].channels) {
            channelToServer[channelId] = bot.servers[serverId];
         }
         logger.info(`Server '${bot.servers[serverId].name}' with ID '${serverId}' has ${Object.keys(bot.servers[serverId].channels).length} channels`);
      }
      logger.info(`Total channels: ${Object.keys(bot.channels).length}`);
   });

   eventHandler.disconnect.listen((event: DisconnectEvent): void => {
      logger.info("Disconnected the bot successfully (" + event.errorMessage + ", " + event.code + "). Exiting...");
   });

   const commandRegistry: CommandRegistry = new CommandRegistry(bot, database, "(´･ω･`)");
   eventHandler.messageCreate.listen((event: MessageCreateEvent) => {
      commandRegistry.scanMessage(event, eventHandler);
   });

   process.on("SIGTERM", handleTermination);
   process.on("SIGINT", handleTermination);

   function handleTermination(): void {
      logger.warn("Caught interrupt signal");
      if (bot.connected) {
         logger.warn("The bot is connected. Attempting to disconnect...");
         setTimeout((): void => {
            logger.error("The bot could not disconnect in 10 seconds. Exiting...");
            process.exit();
         }, 10000);

         bot.disconnect();
      } else {
         process.exit();
      }
   }
}

main().then(() => {
   logger.info("Initialization done");
});
