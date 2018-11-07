import { CallbackCollection } from "./callback-collection";
import { DisconnectEvent } from "./event-types/disconnect.event";
import { GuildCreateEvent } from "./event-types/guild-create.event";
import { MessageCreateEvent } from "./event-types/message-create.event";
import { MessageDeleteBulkEvent } from "./event-types/message-delete-bulk.event";
import { MessageDeleteEvent } from "./event-types/message-delete.event";
import { MessageReactionAddRemoveEvent } from "./event-types/message-reaction-add-remove.event";
import { PresenceUpdateEvent } from "./event-types/presence-update.event";
import { ReadyEvent } from "./event-types/ready.event";

export interface EventHandler {

   messageCreate: CallbackCollection<MessageCreateEvent>;
   messageDelete: CallbackCollection<MessageDeleteEvent>;
   messageDeleteBulk: CallbackCollection<MessageDeleteBulkEvent>;
   ready: CallbackCollection<ReadyEvent>;
   disconnect: CallbackCollection<DisconnectEvent>;
   messageReactionAdd: CallbackCollection<MessageReactionAddRemoveEvent>;
   messageReactionRemove: CallbackCollection<MessageReactionAddRemoveEvent>;
   guildCreate: CallbackCollection<GuildCreateEvent>;
   presenceUpdate: CallbackCollection<PresenceUpdateEvent>;

   // Special handlers

   /**
    * @param message The message to listen to.
    * @param callback The callback called whenever a reaction is added/removed.
    */
   listenForReactions(message: MessageCreateEvent,
      callback: (event: MessageReactionAddRemoveEvent) => void): void;
}
