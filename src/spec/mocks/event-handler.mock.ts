import { CallbackCollection } from "../../main/events/callback-collection";
import { EventHandler } from "../../main/events/event-handler";
import { DisconnectEvent } from "../../main/events/event-types/disconnect.event";
import { GuildCreateEvent } from "../../main/events/event-types/guild-create.event";
import { MessageCreateEvent } from "../../main/events/event-types/message-create.event";
import { MessageReactionAddRemoveEvent } from "../../main/events/event-types/message-reaction-add-remove.event";
import { PresenceUpdateEvent } from "../../main/events/event-types/presence-update.event";
import { ReadyEvent } from "../../main/events/event-types/ready.event";

export class EventHandlerMock implements EventHandler {

   public readonly messageCreate: CallbackCollectionMock<MessageCreateEvent> = new CallbackCollectionMock();
   public readonly ready: CallbackCollectionMock<ReadyEvent> = new CallbackCollectionMock();
   public readonly disconnect: CallbackCollectionMock<DisconnectEvent> = new CallbackCollectionMock();
   public readonly messageReactionAdd: CallbackCollectionMock<MessageReactionAddRemoveEvent> = new CallbackCollectionMock();
   public readonly messageReactionRemove: CallbackCollectionMock<MessageReactionAddRemoveEvent> = new CallbackCollectionMock();
   public readonly guildCreate: CallbackCollectionMock<GuildCreateEvent> = new CallbackCollectionMock();
   public readonly presenceUpdate: CallbackCollectionMock<PresenceUpdateEvent> = new CallbackCollectionMock();
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
