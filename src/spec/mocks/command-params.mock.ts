import { Bot } from "../../main/bot/bot";
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

   bot: Bot = new BotMock();
   database: Database = new DatabaseMock();
   command: string;
   parts: string[];
   event: MessageCreateEvent = <MessageCreateEvent>{};
   channelId: string = CommandParamsMock.DEFAULT_CHANNEL_ID;
   authorId: string = CommandParamsMock.DEFAULT_AUTHOR_ID;
   eventHandler: EventHandler = new EventHandlerMock();

   constructor(commandName: string, args?: string[]) {
      this.command = commandName;
      this.parts = args ? [commandName].concat(args) : [commandName];
   }
}
