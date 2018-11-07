import * as logger from "winston";
import { CallbackCollection } from "../../main/events/callback-collection";
import { EventHandler } from "../../main/events/event-handler";
import { DisconnectEvent } from "../../main/events/event-types/disconnect.event";
import { GuildCreateEvent } from "../../main/events/event-types/guild-create.event";
import { MessageCreateEvent } from "../../main/events/event-types/message-create.event";
import { MessageDeleteBulkEvent } from "../../main/events/event-types/message-delete-bulk.event";
import { MessageDeleteEvent } from "../../main/events/event-types/message-delete.event";
import { MessageReactionAddRemoveEvent } from "../../main/events/event-types/message-reaction-add-remove.event";
import { PresenceUpdateEvent } from "../../main/events/event-types/presence-update.event";
import { ReadyEvent } from "../../main/events/event-types/ready.event";

export class EventHandlerMock implements EventHandler {

   private readonly preparedReactions: { [messageId: string]: MessageReactionAddRemoveEvent[] } = {};

   public readonly messageCreate: CallbackCollectionMock<MessageCreateEvent> = new CallbackCollectionMock();
   public readonly messageDelete: CallbackCollectionMock<MessageDeleteEvent> = new CallbackCollectionMock();
   public readonly messageDeleteBulk: CallbackCollectionMock<MessageDeleteBulkEvent> = new CallbackCollectionMock();
   public readonly ready: CallbackCollectionMock<ReadyEvent> = new CallbackCollectionMock();
   public readonly disconnect: CallbackCollectionMock<DisconnectEvent> = new CallbackCollectionMock();
   public readonly messageReactionAdd: CallbackCollectionMock<MessageReactionAddRemoveEvent> = new CallbackCollectionMock();
   public readonly messageReactionRemove: CallbackCollectionMock<MessageReactionAddRemoveEvent> = new CallbackCollectionMock();
   public readonly guildCreate: CallbackCollectionMock<GuildCreateEvent> = new CallbackCollectionMock();
   public readonly presenceUpdate: CallbackCollectionMock<PresenceUpdateEvent> = new CallbackCollectionMock();

   public listenForReactions(message: MessageCreateEvent,
      callback: (event: MessageReactionAddRemoveEvent) => void): void {

      if ((this.preparedReactions[message.id] || []).length === 0) {
         throw new Error("EventHandlerMock#listenForReactions should be spied upon or " +
            "EventHandlerMock#prepareReaction should be called!");
      }
      logger.info(`Found a prepared reaction for message '${message.id}'`);
      for (const reaction of this.preparedReactions[message.id]) {
         callback(reaction);
      }
      delete this.preparedReactions[message.id];
   }

   public prepareReaction(message: MessageCreateEvent, reaction: MessageReactionAddRemoveEvent): void {
      logger.info(`Preparing a reaction for message '${message.id}'. The reaction is by user '${reaction.user_id}'.`);
      this.preparedReactions[message.id] = this.preparedReactions[message.id] || [];
      this.preparedReactions[message.id].push(reaction);
   }
}

class CallbackCollectionMock<EventType> implements CallbackCollection<EventType> {

   public readonly callbacks: ((event: EventType) => void)[] = [];

   public listen(callback: (event: EventType) => void): number {
      this.callbacks.push(callback);
      return 0;
   }

   public trigger(data: EventType): void {
      for (const callback of this.callbacks) {
         callback(data);
      }
   }
}
