import * as Discord from "discord.io";
import * as fs from "fs";
import * as logger from "winston";
import { DisconnectEvent } from "./event-types/disconnect.event";
import { GuildCreateEvent } from "./event-types/guild-create.event";
import { MessageCreateEvent } from "./event-types/message-create.event";
import { MessageReactionAddEvent } from "./event-types/message-reaction-add.event";
import { PresenceUpdateEvent } from "./event-types/presence-update.event";
import { WebSocketEvent } from "./web-socket-event";

type Callback<EventType> = (event: EventType) => void;

export class EventHandler {
   private readonly eventToCollection: { [event: string]: { [id: number]: Callback<any> } } = {};

   public readonly messageCreate: CallbackCollection<MessageCreateEvent> =
      new CallbackCollection(this.eventToCollection, "MESSAGE_CREATE");

   public readonly ready: CallbackCollection<void> =
      new CallbackCollection(this.eventToCollection, "READY");

   public readonly disconnect: CallbackCollection<DisconnectEvent> =
      new CallbackCollection(this.eventToCollection, "DISCONNECT");

   public readonly messageReactionAdd: CallbackCollection<MessageReactionAddEvent> =
      new CallbackCollection(this.eventToCollection, "MESSAGE_REACTION_ADD");

   public readonly guildCreate: CallbackCollection<GuildCreateEvent> =
      new CallbackCollection(this.eventToCollection, "GUILD_CREATE");

   public readonly presenceUpdate: CallbackCollection<PresenceUpdateEvent> =
      new CallbackCollection(this.eventToCollection, "PRESENCE_UPDATE");

   constructor(bot: Discord.Client) {
      bot.on("any", (event: WebSocketEvent): void => {
         const collection: { [id: number]: Callback<any> } = this.eventToCollection[event.t];

         const eventFilename: string = "./data/" + event.t + ".json";
         if (event.t && !fs.existsSync(eventFilename)) {
            const initial: any = fs.existsSync(eventFilename) ? JSON.parse(fs.readFileSync(eventFilename, "utf8")) : {};

            const current: any = event.d;
            let hasDifference: boolean = false;

            for (const prop in current) {
               if (!initial[prop]) {
                  hasDifference = true;
                  initial[prop] = current[prop];
               }
            }

            if (hasDifference) {
               logger.info("Saving the data of collection for event of type '" + event.t + "'");
               fs.writeFileSync(eventFilename, JSON.stringify(initial));
            }
         }

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
   }
}

class CallbackCollection<EventType> {
   private static idCounter: number = 0;
   private readonly collection: { [id: number]: Callback<EventType> } = {};

   constructor(eventToCollection: { [event: string]: { [id: number]: Callback<EventType> } },
      eventName: string) {
      eventToCollection[eventName] = this.collection;
   }

   public listen(callback: Callback<EventType>): number {
      this.collection[++CallbackCollection.idCounter] = callback;
      return CallbackCollection.idCounter;
   }
}
