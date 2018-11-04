import { CallbackCollection } from "./callback-collection";
import { DisconnectEvent } from "./event-types/disconnect.event";
import { GuildCreateEvent } from "./event-types/guild-create.event";
import { MessageCreateEvent } from "./event-types/message-create.event";
import { MessageReactionAddRemoveEvent } from "./event-types/message-reaction-add-remove.event";
import { PresenceUpdateEvent } from "./event-types/presence-update.event";
import { ReadyEvent } from "./event-types/ready.event";

export interface EventHandler {

   messageCreate: CallbackCollection<MessageCreateEvent>;
   ready: CallbackCollection<ReadyEvent>;
   disconnect: CallbackCollection<DisconnectEvent>;
   messageReactionAdd: CallbackCollection<MessageReactionAddRemoveEvent>;
   messageReactionRemove: CallbackCollection<MessageReactionAddRemoveEvent>;
   guildCreate: CallbackCollection<GuildCreateEvent>;
   presenceUpdate: CallbackCollection<PresenceUpdateEvent>;
}
