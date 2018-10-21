import * as Discord from "discord.io";
import * as logger from "winston";
import * as fs from "fs";
import { TransformableInfo } from "logform";
import { MessageData } from "./discord-types";

const auth: any = JSON.parse(fs.readFileSync("auth.json", "utf8"));

const opts: any = { colorize: true };

const timestampFormat: () => string = (): string => (new Date().toISOString());

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

type WebSocketEvent = {
   d: MessageData;
   op: number;
   s: number;
   t: string;
};

// Initialize Discord Bot
logger.info("Initializing the bot with token '" + auth.token + "'...");
const bot: Discord.Client = new Discord.Client({
   token: auth.token,
   autorun: true
});

// bot.on("ready", function (evt) {
bot.on("ready", (): void => {
   logger.info("Connected");
   logger.info("Logged in as: ");
   logger.info(bot.username + " - (" + bot.id + ")");
   debugger;
});

const prefix: string = "(´･ω･`)";

// bot.on("message", function (user, userID, channelID, message, evt) {
bot.on("message", (user: string, userID: string, channelID: string, message: string, event: WebSocketEvent): void => {

   logger.debug("Message '" + message + "' has been sent by user " + user + "#" + userID +
      " at channel with ID '" + channelID + "'");
   if (!message || user === "<|°_°|>") {
      logger.silly("Event:\n" + JSON.stringify(event));
   }

   // Ignore messgaes not directed to this bot
   if (message.indexOf(prefix) !== 0) {
      return;
   }
   const parts: string[] = message.replace(prefix, "").trim().split(" ");
   const command: string = parts[0];

   logger.info("Command '" + command + "' with arguments [" +
      parts.slice(1).map((part: string): string => "'" + part + "'").join(", ") +
      "] has been executed by user " + user + "#" + userID + " at channel with ID '" + channelID + "'");

   switch (command) {
      case "ping":
         break;
      case "be-mean":
         bot.sendMessage({
            to: channelID,
            message: "~slap <@" + userID + ">",
            typing: true,
         });
         break;
      case "sleep":
         if (userID !== "258312787422347264") {
            bot.sendMessage({
               to: channelID,
               message: "Not until you've read me a bedtime story, hmph (￣^￣)",
            });
            return;
         }
         if (!parts[1]) {
            logger.error("The 'sleep' command requires a parameter!");
            return;
         }
         const delay: number = getTimeInMs(parts[1]);
         if (delay < 0) {
            return;
         }
         bot.disconnect();
         const subDelay: number = Math.max(delay / 30, 200);
         const beginningTime: number = new Date().getTime();
         const endTime: number = beginningTime + delay;
         const intervalId: NodeJS.Timeout = setInterval((): void => {
            const currentTime: number = new Date().getTime();
            const percentage: number = Math.round((currentTime - beginningTime) * 100.0 / delay);
            let percentageString: string = "";
            let percentageLeft: number = percentage;
            for (let i: number = 0; i < 10; i++) {
               if (percentageLeft >= 8) {
                  percentageString += "■";
               } else if (percentageLeft >= 3) {
                  percentageString += "▣";
               } else {
                  percentageString += "□";
               }
               percentageLeft -= 10;
            }
            const secondsLeft: number = Math.round((endTime - currentTime) / 1000);
            logger.info(percentageString + " -- Waking up in " + secondsLeft + " second" + (secondsLeft === 1 ? "" : "s") + " (" + percentage + "%)");
         }, subDelay);
         setTimeout((): void => {
            clearInterval(intervalId);
            if (!bot.connected) {
               bot.connect();
            } else {
               logger.error("The bot is already connected but it should be disconnected!");
            }
         }, delay);
         break;
      case "die":
         if (userID !== "258312787422347264") {
            bot.sendMessage({
               to: channelID,
               message: "How dare you... :shiba-heartbroken:",
            });
            return;
         }
         if (parts[1]) {
            const delay: number = getTimeInMs(parts[1]);
            if (delay < 0) {
               return;
            }
            setTimeout((): void => {
               bot.on("disconnect", (errorMessage: string, code: number): void => {
                  logger.info("Disconnected the bot successfully (" + errorMessage + ", " + code + "). Exiting...");
                  process.exit();
               });
               bot.disconnect();
            }, delay);
         } else {
            bot.on("disconnect", (errorMessage: string, code: number): void => {
               logger.info("Disconnected the bot successfully (" + errorMessage + ", " + code + "). Exiting...");
               process.exit();
            });
            bot.disconnect();
         }
         break;
      case "":
         bot.sendMessage({
            to: channelID,
            message: "(* >ω<)!",
         });
         break;
   }
});

process.on("SIGTERM", handleTermination);
process.on("SIGINT", handleTermination);

function handleTermination(): void {
   logger.warn("Caught interrupt signal");
   if (bot.connected) {
      logger.warn("The bot is connected. Attempting to disconnect...");

      bot.on("disconnect", (errorMessage: string, code: number): void => {
         logger.info("Disconnected the bot successfully. Exiting...");
         process.exit();
      });
      setTimeout((): void => {
         logger.error("The bot could not disconnect in 10 seconds. Exiting...");
         process.exit();
      }, 10000);

      bot.disconnect();
   } else {
      process.exit();
   }
}

function getTimeInMs(delay: string): number {
   if (delay[0] === "-") {
      logger.error("The delay cannot be negative: " + delay);
      return -1;
   }
   if (delay.endsWith("s") && !isNaN(parseFloat(delay.replace("s", "")))) {
      return parseFloat(delay.replace("s", "")) * 1000;
   }
   if (delay.endsWith("min") && !isNaN(parseFloat(delay.replace("min", "")))) {
      return parseFloat(delay.replace("min", "")) * 60 * 1000;
   }
   if (delay.endsWith("h") && !isNaN(parseFloat(delay.replace("h", "")))) {
      return parseFloat(delay.replace("h", "")) * 60 * 60 * 1000;
   }
   logger.error("Invalid delay: " + delay);
   return -1;
}

