import * as Discord from "discord.io";
import * as logger from "winston";
import { CallbackError } from "../discord-types";
import { EventHandler } from "../events/event-handler";
import { DisconnectEvent } from "../events/event-types/disconnect.event";
import { MessageCreateEvent } from "../events/event-types/message-create.event";
import { MessageReactionAddRemoveEvent } from "../events/event-types/message-reaction-add-remove.event";
import { Bot } from "./bot";
import { SendMessageOptions } from "./method-params";

export class DiscordBot implements Bot {

   private readonly reactionListeners: { [id: string]: (event: MessageReactionAddRemoveEvent) => void } = {};
   private disconnectResolve?: (event: DisconnectEvent) => void;

   constructor(
      private readonly nativeBot: Discord.Client,
      eventHandler: EventHandler) {

      logger.info("DiscordBot :: Initializing...");
      eventHandler.messageReactionAdd.listen((event: MessageReactionAddRemoveEvent): void => {
         if (this.reactionListeners[event.message_id]) {
            this.reactionListeners[event.message_id](event);
         }
      });
      eventHandler.messageReactionRemove.listen((event: MessageReactionAddRemoveEvent): void => {
         if (this.reactionListeners[event.message_id]) {
            this.reactionListeners[event.message_id](event);
         }
      });

      eventHandler.disconnect.listen((event: DisconnectEvent): void => {
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

   public reactTo(message: MessageCreateEvent, reaction: string): Promise<void> {
      return new Promise((resolve: () => void, reject: (error: Error) => void): void => {
         this.nativeBot.addReaction({
            channelID: message.channel_id,
            messageID: message.id,
            reaction: reaction,
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

   private makeError(error: CallbackError): Error {
      const errorCode: string = error.statusCode === undefined ? "?" : error.statusCode;
      const errorMessage: string = error.response || error.message || "No error message";
      return new Error("[" + errorCode + "] " + errorMessage);
   }
}
