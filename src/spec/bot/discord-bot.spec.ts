import * as Discord from "discord.io";
import { Bot } from "../../main/bot/bot";
import { DiscordBot } from "../../main/bot/discord-bot";
import { SendMessageOptions } from "../../main/bot/method-params";
import { CallbackError } from "../../main/discord-types";
import { DisconnectEvent } from "../../main/events/event-types/disconnect.event";
import { MessageCreateEvent } from "../../main/events/event-types/message-create.event";
import { EventHandlerMock } from "../mocks/event-handler.mock";
import { TimeServiceMock } from "../mocks/time-service-mock";

type BotActionCallback = (error: CallbackError | undefined, result?: any) => void;

interface ThisTest {
   bot: Bot;
   nativeBot: Discord.Client;
   eventHandler: EventHandlerMock;
   timeService: TimeServiceMock;

   promise: Promise<any>;
   callback: BotActionCallback;
   expectPromiseToFailWithError: (promise: Promise<any>, errorMessage: string) => Promise<void>;
}

describe("DiscordBot", () => {
   beforeEach(function (this: ThisTest): void {
      this.nativeBot = jasmine.createSpyObj("Discord.Client", ["disconnect", "sendMessage", "deleteMessage"]);
      this.eventHandler = new EventHandlerMock();
      this.bot = new DiscordBot(this.nativeBot, this.eventHandler);

      expect(this.eventHandler.disconnect.callbacks.length).toBe(1);
      expect(this.eventHandler.messageReactionAdd.callbacks.length).toBe(1);
      expect(this.eventHandler.messageReactionRemove.callbacks.length).toBe(1);

      this.expectPromiseToFailWithError = async function (promise: Promise<any>, errorMessage: string): Promise<void> {
         const error: Error | undefined = await promise
            .then(() => undefined)
            .catch((error: Error) => error);

         expect(error).not.toBeUndefined();
         if (error) {
            expect(error.message).toBe(errorMessage);
         }
      };
   });

   describe("WHEN the bot is disconnected without calling #disconnect", () => {
      it("THEN an error should be thrown", function (this: ThisTest): void {
         expect(() => this.eventHandler.disconnect.trigger({} as any)).toThrowError(
            "The bot is disconnecting but there is no listener. A disconnect " +
            "attempt must have been made outside of DiscordBot#disconnect");
      });
   });

   describe("#disconnect", () => {
      it("should disconnect the bot", async function (this: ThisTest): Promise<void> {
         expect(this.nativeBot.disconnect).not.toHaveBeenCalled();
         const promise: Promise<DisconnectEvent> = this.bot.disconnect();
         expect(this.nativeBot.disconnect).toHaveBeenCalled();

         const expectedEvent: DisconnectEvent = {} as any;
         this.eventHandler.disconnect.trigger(expectedEvent);
         const actualEvent: DisconnectEvent = await promise;
         expect(actualEvent).toBe(expectedEvent);
      });
   });

   describe("#sendMessage", () => {
      beforeEach(async function (this: ThisTest): Promise<void> {
         expect(this.nativeBot.deleteMessage).not.toHaveBeenCalled();
         const options: SendMessageOptions = {} as any;
         this.promise = this.bot.sendMessage(options);
         expect(this.nativeBot.sendMessage).toHaveBeenCalled();
         const args: any[] = (this.nativeBot.sendMessage as jasmine.Spy).calls.mostRecent().args;
         expect(args.length).toBe(2);
         expect(args[0]).toBe(options);
         this.callback = args[1];
         expect(typeof this.callback).toBe("function");
      });

      describe("WHEN there is an error", () => {
         it("THEN the promise should fail", async function (this: ThisTest): Promise<void> {
            this.callback({ message: "Could not send the message" }, undefined);
            this.expectPromiseToFailWithError(this.promise, "[?] Could not send the message");
         });
      });

      it("should send a message", async function (this: ThisTest): Promise<void> {
         const expectedEvent: MessageCreateEvent = {} as any;
         this.callback(undefined, expectedEvent);
         expect(await this.promise).toBe(expectedEvent);
      });
   });

   describe("#deleteMessage", () => {
      beforeEach(async function (this: ThisTest): Promise<void> {
         expect(this.nativeBot.deleteMessage).not.toHaveBeenCalled();
         const message: MessageCreateEvent = {
            channel_id: "some-channel-id",
            id: "some-message-id",
         } as any;
         this.promise = this.bot.deleteMessage(message);
         expect(this.nativeBot.deleteMessage).toHaveBeenCalled();
         const args: any[] = (this.nativeBot.deleteMessage as jasmine.Spy).calls.mostRecent().args;
         expect(args.length).toBe(2);
         expect(args[0]).toEqual({
            channelID: message.channel_id,
            messageID: message.id,
         });
         this.callback = args[1];
         expect(typeof this.callback).toBe("function");
      });

      describe("WHEN there is an error", () => {
         it("THEN the promise should fail", async function (this: ThisTest): Promise<void> {
            this.callback({ message: "Could not delete the message", statusCode: "23" });
            this.expectPromiseToFailWithError(this.promise, "[23] Could not delete the message");
         });
      });

      it("should delete a message", async function (this: ThisTest): Promise<void> {
         this.callback(undefined);
         expect(await this.promise).toBe(undefined);
      });
   });
});
