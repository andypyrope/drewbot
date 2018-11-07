import * as Discord from "discord.io";
import * as logger from "winston";
import { CallbackError } from "../discord-types";
import { EventHandler } from "../events/event-handler";
import { DisconnectEvent } from "../events/event-types/disconnect.event";
import { MessageCreateEvent } from "../events/event-types/message-create.event";
import { MessageReactionAddRemoveEvent } from "../events/event-types/message-reaction-add-remove.event";
import { TimeService } from "../util/time-service";
import { Bot } from "./bot";
import { ReactionEvent } from "./custom-event-types/reaction.event";
import { PromptOptions, SendMessageOptions } from "./method-params";
import { PresetEmoji } from "./preset-emoji";

export class DiscordBot implements Bot {

   private disconnectResolve?: (event: DisconnectEvent) => void;

   constructor(
      private readonly nativeBot: Discord.Client,
      private readonly eventHandler: EventHandler,
      private readonly timeService: TimeService) {

      logger.info("DiscordBot :: Initializing...");

      eventHandler.disconnect.listen((event: DisconnectEvent): void => {
         logger.warn("DiscordBot :: The bot has been disconnected.");
         if (this.disconnectResolve) {
            this.disconnectResolve(event);
            this.disconnectResolve = undefined;
         } else {
            throw new Error("The bot is disconnecting but there is no listener. A disconnect " +
               "attempt must have been made outside of DiscordBot#disconnect");
         }
      });
   }

   public disconnect(): Promise<DisconnectEvent> {
      this.nativeBot.disconnect();
      return new Promise((resolve: (event: DisconnectEvent) => void): void => {
         if (this.disconnectResolve) {
            throw new Error("The bot is already disconnecting!");
         }
         this.disconnectResolve = resolve;
      });
   }

   public sendMessage(options: SendMessageOptions): Promise<MessageCreateEvent> {
      return new Promise((resolve: (event: MessageCreateEvent) => void, reject: (error: Error) => void): void => {
         this.nativeBot.sendMessage(options, (error: CallbackError, result: MessageCreateEvent): void => {
            if (error) {
               logger.error("DiscordBot :: Failed to send message '" + options.message + "' due to: " + error.message);
               reject(this.makeError(error));
            } else {
               resolve(result);
            }
         });
      });
   }

   public deleteMessage(message: MessageCreateEvent): Promise<void> {
      return new Promise((resolve: () => void, reject: (error: Error) => void): void => {
         this.nativeBot.deleteMessage({
            channelID: message.channel_id,
            messageID: message.id,
         }, (error: CallbackError): void => {
            if (error) {
               logger.error("DiscordBot :: Failed to delete message #" + message.id + " ('" +
                  message.content + "') due to: " + error.message);
               reject(this.makeError(error));
            } else {
               resolve();
            }
         });
      });
   }

   public reactTo(message: MessageCreateEvent, reaction: PresetEmoji): Promise<void> {
      return new Promise((resolve: () => void, reject: (error: Error) => void): void => {
         this.nativeBot.addReaction({
            channelID: message.channel_id,
            messageID: message.id,
            reaction: reaction.toString(),
         }, (error: CallbackError | undefined): void => {
            if (error) {
               logger.error("DiscordBot :: Failed to add reaction '" + reaction + "' to message #" +
                  message.id + " ('" + message.content + "') due to: " + error.message);
               reject(this.makeError(error));
            } else {
               resolve();
            }
         });
      });
   }

   public async promptWithReaction(options: PromptOptions): Promise<ReactionEvent> {
      options.message = (options.message ? options.message + "\n\n" : "") + "React to answer.";
      const message: MessageCreateEvent = await this.sendMessage(options);

      try {
         for (const choice of options.choices) {
            await this.timeService.wait(200);
            await this.reactTo(message, choice);
         }
      } catch (error) {
         await this.deleteMessage(message);
         throw error;
      }

      return new Promise((resolve: (result: ReactionEvent) => void, reject: (error: Error) => void): void => {
         const timeoutId: NodeJS.Timeout | undefined = options.timeoutMs === undefined
            ? undefined
            : setTimeout(async (): Promise<void> => {
               await this.deleteMessage(message);
               reject(new Error("No response in " + options.timeoutMs + " ms"));
            }, options.timeoutMs);

         this.eventHandler.listenForReactions(message, (reaction: MessageReactionAddRemoveEvent): void => {
            if (reaction.user_id === this.nativeBot.id
               || (options.recipientId && reaction.user_id !== options.recipientId)) {
               return;
            }

            const emojiFullId: string = reaction.emoji.name + ":" +
               reaction.emoji.id;

            logger.info("DiscordBot :: Reaction " + emojiFullId + " at '" + message.content + "'");

            const index: number = options.choices.findIndex((emoji: PresetEmoji): boolean =>
               emoji.hasNameAndId(reaction.emoji.name, reaction.emoji.id));

            if (index === -1) {
               return;
            }

            if (timeoutId) {
               logger.debug(`DiscordBot :: Clearing the timeout for message '${message.id}'`);
               clearTimeout(timeoutId);
            }

            if (options.deleteAfterwards) {
               logger.debug(`DiscordBot :: Deleting reaction message '${message.id}'`);
               this.deleteMessage(message);
            }

            resolve({
               reactionIndex: index,
               userId: reaction.user_id,
            });
         });
      });
   }

   private makeError(error: CallbackError): Error {
      const errorCode: string = error.statusCode === undefined ? "?" : error.statusCode;
      const errorMessage: string = error.response || error.message || "No error message";
      return new Error("[" + errorCode + "] " + errorMessage);
   }
}
