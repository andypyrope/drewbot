import { DisconnectEvent } from "../events/event-types/disconnect.event";
import { MessageCreateEvent } from "../events/event-types/message-create.event";
import { ReactionEvent } from "./custom-event-types/reaction.event";
import { PromptOptions, SendMessageOptions } from "./method-params";

/**
 * Bot wrapper.
 */
export interface Bot {

   /**
    * Disconnects the bot.
    *
    * @returns {Promise<void>} A promise resolved when disconnecting is complete.
    */
   disconnect(): Promise<DisconnectEvent>;

   /**
    * Sends a message.
    *
    * @param options The options for the message.
    * @returns {Promise<MessageCreateEvent>} A promise resolved when the reaction is complete,
    * containing the information about the new message.
    */
   sendMessage(options: SendMessageOptions): Promise<MessageCreateEvent>;

   /**
    * Deletes a message.
    *
    * @param message The message to delete.
    * @returns {Promise<void>} A promise resolved when the reaction is complete.
    */
   deleteMessage(message: MessageCreateEvent): Promise<void>;

   /**
    * Adds a reaction to a message.
    *
    * @param message The message to react to.
    * @param reaction The reaction to the message (an emoji code).
    * @returns {Promise<void>} A promise resolved when the reaction is complete.
    */
   reactTo(message: MessageCreateEvent, reaction: string): Promise<void>;
}
