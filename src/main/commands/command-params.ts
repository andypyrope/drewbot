import * as Discord from "discord.io";
import { EventHandler } from "../events/event-handler";
import { MessageCreateEvent } from "../events/event-types/message-create.event";

export interface CommandParams {
   bot: Discord.Client;
   command: string;
   parts: string[];
   event: MessageCreateEvent;
   channelId: string;
   authorId: string;
   eventHandler: EventHandler;
}
