import * as Discord from "discord.io";
import { MessageCreateEvent } from "../events/event-types/message-create.event";

export interface CommandHandler {
   getInfo(): string;

   getCommands(): string[];

   execute(bot: Discord.Client, args: string[], channelId: string, event: MessageCreateEvent): void;
}
