import { Bot } from "../../main/bot/bot";
import { ReactionEvent } from "../../main/bot/custom-event-types/reaction.event";
import { PromptOptions, SendMessageOptions } from "../../main/bot/method-params";
import { PresetEmoji } from "../../main/bot/preset-emoji";
import { DisconnectEvent } from "../../main/events/event-types/disconnect.event";
import { MessageCreateEvent } from "../../main/events/event-types/message-create.event";

export class BotMock implements Bot {

   disconnect(): Promise<DisconnectEvent> {
      throw new Error("BotMock#disconnect should be spied upon.");
   }

   sendMessage(options: SendMessageOptions): Promise<MessageCreateEvent> {
      throw new Error("BotMock#sendMessage should be spied upon.");
   }

   deleteMessage(message: MessageCreateEvent): Promise<void> {
      throw new Error("BotMock#deleteMessage should be spied upon.");
   }

   reactTo(message: MessageCreateEvent, reaction: PresetEmoji): Promise<void> {
      throw new Error("BotMock#reactTo should be spied upon.");
   }

   promptWithReaction(options: PromptOptions): Promise<ReactionEvent> {
      throw new Error("BotMock#promptWithReaction should be spied upon.");
   }
}
