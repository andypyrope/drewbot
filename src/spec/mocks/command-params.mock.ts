import * as Discord from "discord.io";
import { CommandParams } from "../../main/commands/command-params";
import { Database } from "../../main/db/database";
import { EventHandler } from "../../main/events/event-handler";
import { MessageCreateEvent } from "../../main/events/event-types/message-create.event";
import { BotMock } from "./bot.mock";
import { DatabaseMock } from "./database.mock";
import { EventHandlerMock } from "./event-handler.mock";

export class CommandParamsMock implements CommandParams {

   public static readonly DEFAULT_CHANNEL_ID: string = "123";
   public static readonly DEFAULT_AUTHOR_ID: string = "123426346";

   bot: Discord.Client;
   database: Database;
   command: string;
   parts: string[];
   event: MessageCreateEvent;
   channelId: string;
   authorId: string;
   eventHandler: EventHandler;

   constructor(commandName: string, args?: string[]) {
      this.bot = new BotMock().getMocked();
      this.database = new DatabaseMock();
      this.command = commandName;
      this.parts = args ? [commandName].concat(args) : [commandName];
      this.event = <MessageCreateEvent>{};
      this.channelId = CommandParamsMock.DEFAULT_CHANNEL_ID;
      this.authorId = CommandParamsMock.DEFAULT_AUTHOR_ID;
      this.eventHandler = new EventHandlerMock().getMocked();
   }
}
