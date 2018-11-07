import * as Discord from "discord.io";
import * as fs from "fs";
import { TransformableInfo } from "logform";
import "reflect-metadata";
import * as logger from "winston";
import { Bot } from "./bot/bot";
import { DiscordBot } from "./bot/discord-bot";
import { CommandRegistry } from "./commands/command-registry";
import { TypeormDatabase } from "./db/typeorm-database";
import { EventHandler } from "./events/event-handler";
import { DisconnectEvent } from "./events/event-types/disconnect.event";
import { MessageCreateEvent } from "./events/event-types/message-create.event";
import { StandardEventHandler } from "./events/standard-event-handler";
import { StandardTimeService } from "./util/standard-time-service";

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
   const rawBot: Discord.Client = new Discord.Client({
      token: auth.token,
      autorun: true
   });

   const eventHandler: EventHandler = new StandardEventHandler(rawBot);
   const bot: Bot = new DiscordBot(rawBot, eventHandler, new StandardTimeService());

   const channelToServer: { [channelId: string]: Discord.Server } = {};

   eventHandler.ready.listen((): void => {
      logger.info("Connected");
      logger.info("Logged in as: ");
      logger.info(rawBot.username + " - (" + rawBot.id + ")");
      for (const serverId in rawBot.servers) {
         for (const channelId in rawBot.servers[serverId].channels) {
            channelToServer[channelId] = rawBot.servers[serverId];
         }
         logger.info(`Server '${rawBot.servers[serverId].name}' with ID '${serverId}' has ${Object.keys(rawBot.servers[serverId].channels).length} channels`);
      }
      logger.info(`Total channels: ${Object.keys(rawBot.channels).length}`);
   });

   eventHandler.disconnect.listen((event: DisconnectEvent): void => {
      logger.info("Disconnected the bot successfully (" + event.errorMessage + ", " + event.code + "). Exiting...");
   });

   const commandRegistry: CommandRegistry = new CommandRegistry(bot, database, eventHandler, "(´･ω･`)");

   process.on("SIGTERM", handleTermination);
   process.on("SIGINT", handleTermination);

   async function handleTermination(): Promise<void> {
      logger.warn("Caught interrupt signal");
      if (rawBot.connected) {
         logger.warn("The bot is connected. Disconnecting...");
         await bot.disconnect();
      }
      process.exit();
   }
}

main().then(() => {
   logger.info("Initialization done");
});
