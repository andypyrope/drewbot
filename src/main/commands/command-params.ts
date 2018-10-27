import * as Discord from "discord.io";
import { Database } from "../db/database";
import { EventHandler } from "../events/event-handler";
import { MessageCreateEvent } from "../events/event-types/message-create.event";

export interface CommandParams {
   bot: Discord.Client;
   database: Database;
   command: string;
   parts: string[];
   event: MessageCreateEvent;
   channelId: string;
   authorId: string;
   eventHandler: EventHandler;
}
