import * as Discord from "discord.io";
import * as fs from "fs";
import * as logger from "winston";
import { CallbackCollection } from "./callback-collection";
import { EventHandler } from "./event-handler";
import { DisconnectEvent } from "./event-types/disconnect.event";
import { GuildCreateEvent } from "./event-types/guild-create.event";
import { MessageCreateEvent } from "./event-types/message-create.event";
import { MessageDeleteBulkEvent } from "./event-types/message-delete-bulk.event";
import { MessageDeleteEvent } from "./event-types/message-delete.event";
import { MessageReactionAddRemoveEvent } from "./event-types/message-reaction-add-remove.event";
import { PresenceUpdateEvent } from "./event-types/presence-update.event";
import { ReadyEvent } from "./event-types/ready.event";
import { WebSocketEvent } from "./web-socket-event";

type Callback<EventType> = (event: EventType) => void;

export class StandardEventHandler implements EventHandler {
   private readonly eventToCollection: { [event: string]: { [id: number]: Callback<any> } } = {};
   private readonly reactionListeners: { [id: string]: (event: MessageReactionAddRemoveEvent) => void } = {};

   public readonly messageCreate: CallbackCollection<MessageCreateEvent> =
      new StandardCallbackCollection(this.eventToCollection, "MESSAGE_CREATE");

   public readonly messageDelete: CallbackCollection<MessageDeleteEvent> =
      new StandardCallbackCollection(this.eventToCollection, "MESSAGE_DELETE");

   public readonly messageDeleteBulk: CallbackCollection<MessageDeleteBulkEvent> =
      new StandardCallbackCollection(this.eventToCollection, "MESSAGE_DELETE_BULK");

   public readonly ready: CallbackCollection<ReadyEvent> =
      new StandardCallbackCollection(this.eventToCollection, "READY");

   public readonly disconnect: CallbackCollection<DisconnectEvent> =
      new StandardCallbackCollection(this.eventToCollection, "DISCONNECT");

   public readonly messageReactionAdd: CallbackCollection<MessageReactionAddRemoveEvent> =
      new StandardCallbackCollection(this.eventToCollection, "MESSAGE_REACTION_ADD");

   public readonly messageReactionRemove: CallbackCollection<MessageReactionAddRemoveEvent> =
      new StandardCallbackCollection(this.eventToCollection, "MESSAGE_REACTION_REMOVE");

   public readonly guildCreate: CallbackCollection<GuildCreateEvent> =
      new StandardCallbackCollection(this.eventToCollection, "GUILD_CREATE");

   public readonly presenceUpdate: CallbackCollection<PresenceUpdateEvent> =
      new StandardCallbackCollection(this.eventToCollection, "PRESENCE_UPDATE");

   constructor(rawBot: Discord.Client) {
      rawBot.on("any", (event: WebSocketEvent): void => {
         const collection: { [id: number]: Callback<any> } = this.eventToCollection[event.t];
         this.saveEvent(event);

         if (!collection) {
            if (event.t) {
               logger.warn("No callback collection for event of type '" + event.t + "'");
            }
            return;
         }
         for (const id in collection) {
            collection[id](event.d);
         }
      });

      this.messageReactionAdd.listen(this.onReaction.bind(this));
      this.messageReactionRemove.listen(this.onReaction.bind(this));

      this.messageDelete.listen((event: MessageDeleteEvent): void => {
         delete this.reactionListeners[event.id];
      });

      this.messageDeleteBulk.listen((event: MessageDeleteBulkEvent): void => {
         for (const id of event.ids) {
            delete this.reactionListeners[id];
         }
      });
   }

   public listenForReactions(message: MessageCreateEvent,
      callback: (event: MessageReactionAddRemoveEvent) => void): void {
      this.reactionListeners[message.id] = callback;
   }

   private onReaction(event: MessageReactionAddRemoveEvent): void {
      if (this.reactionListeners[event.message_id]) {
         this.reactionListeners[event.message_id](event);
      }
   }

   private saveEvent(event: WebSocketEvent): void {
      const eventFilename: string = "./data/" + event.t + ".json";
      if (event.t && !fs.existsSync(eventFilename)) {
         logger.info("Saving the data of collection for event of type '" + event.t + "'");
         fs.writeFileSync(eventFilename, JSON.stringify(event.d));
      }
   }
}

class StandardCallbackCollection<EventType> implements CallbackCollection<EventType> {
   private static idCounter: number = 0;
   private readonly collection: { [id: number]: Callback<EventType> } = {};

   constructor(eventToCollection: { [event: string]: { [id: number]: Callback<EventType> } },
      eventName: string) {
      eventToCollection[eventName] = this.collection;
   }

   public listen(callback: Callback<EventType>): number {
      this.collection[++StandardCallbackCollection.idCounter] = callback;
      return StandardCallbackCollection.idCounter;
   }
}
