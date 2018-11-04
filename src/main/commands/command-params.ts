import { Bot } from "../bot/bot";
import { Database } from "../db/database";
import { EventHandler } from "../events/event-handler";
import { MessageCreateEvent } from "../events/event-types/message-create.event";

export interface CommandParams {
   bot: Bot;
   database: Database;
   command: string;
   parts: string[];
   event: MessageCreateEvent;
   channelId: string;
   authorId: string;
   eventHandler: EventHandler;
}
