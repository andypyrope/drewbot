import * as Discord from "discord.io";
import { Bot } from "../../main/bot/bot";
import { DiscordBot } from "../../main/bot/discord-bot";
import { PromptOptions, SendMessageOptions } from "../../main/bot/method-params";
import { PresetEmoji } from "../../main/bot/preset-emoji";
import { CallbackError } from "../../main/discord-types";
import { DisconnectEvent } from "../../main/events/event-types/disconnect.event";
import { MessageCreateEvent } from "../../main/events/event-types/message-create.event";
import { MessageReactionAddRemoveEvent } from "../../main/events/event-types/message-reaction-add-remove.event";
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
   expectPromiseToFail: (promise: Promise<any>, errorMessage?: string) => Promise<void>;

   message: MessageCreateEvent;
   promptOptions: PromptOptions;
   goodEmoji: PresetEmoji;
   badEmoji: PresetEmoji;
   makeReactionEvent: (userId: string) => MessageReactionAddRemoveEvent;
}

describe("DiscordBot", () => {
   beforeEach(function (this: ThisTest): void {
      this.nativeBot = jasmine.createSpyObj("Discord.Client", ["disconnect", "sendMessage",
         "deleteMessage", "addReaction"]);
      this.nativeBot.id = "bot-id";
      this.timeService = new TimeServiceMock();
      this.eventHandler = new EventHandlerMock();
      this.bot = new DiscordBot(this.nativeBot, this.eventHandler, this.timeService);
      this.message = {
         channel_id: "some-channel-id",
         id: "some-message-id",
      } as any;

      expect(this.eventHandler.disconnect.callbacks.length).toBe(1);

      this.expectPromiseToFail = async function (promise: Promise<any>, errorMessage?: string): Promise<void> {
         let hasFailed: boolean = false;
         const error: Error | undefined = await promise
            .then(() => undefined)
            .catch((error: Error) => {
               hasFailed = true;
               return error;
            });

         expect(hasFailed).toBe(true, "The promise should fail");
         if (errorMessage) {
            expect(error).not.toBeUndefined("There should be an error");
            if (error) {
               expect(error.message).toBe(errorMessage, "The error message should be correct");
            }
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
            await this.expectPromiseToFail(this.promise, "[?] Could not send the message");
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
         this.promise = this.bot.deleteMessage(this.message);
         expect(this.nativeBot.deleteMessage).toHaveBeenCalled();
         const args: any[] = (this.nativeBot.deleteMessage as jasmine.Spy).calls.mostRecent().args;
         expect(args.length).toBe(2);
         expect(args[0]).toEqual({
            channelID: this.message.channel_id,
            messageID: this.message.id,
         });
         this.callback = args[1];
         expect(typeof this.callback).toBe("function");
      });

      describe("WHEN there is an error", () => {
         it("THEN the promise should fail", async function (this: ThisTest): Promise<void> {
            this.callback({ message: "Could not delete the message", statusCode: "23" });
            await this.expectPromiseToFail(this.promise, "[23] Could not delete the message");
         });
      });

      it("should delete a message", async function (this: ThisTest): Promise<void> {
         this.callback(undefined);
         expect(await this.promise).toBe(undefined);
      });
   });

   describe("#reactTo", () => {
      beforeEach(async function (this: ThisTest): Promise<void> {
         const reaction: PresetEmoji = PresetEmoji.SHIBA_HEARTBROKEN;
         this.promise = this.bot.reactTo(this.message, reaction);
         expect(this.nativeBot.addReaction).toHaveBeenCalled();
         const args: any[] = (this.nativeBot.addReaction as jasmine.Spy).calls.mostRecent().args;
         expect(args.length).toBe(2);
         expect(args[0]).toEqual({
            channelID: this.message.channel_id,
            messageID: this.message.id,
            reaction: reaction.toString(),
         });
         this.callback = args[1];
         expect(typeof this.callback).toBe("function");
      });

      describe("WHEN there is an error", () => {
         it("THEN the promise should fail", async function (this: ThisTest): Promise<void> {
            this.callback({ message: "Could not react to the message", statusCode: "23" });
            await this.expectPromiseToFail(this.promise, "[23] Could not react to the message");
         });
      });

      it("should delete a message", async function (this: ThisTest): Promise<void> {
         this.callback(undefined);
         expect(await this.promise).toBe(undefined);
      });
   });

   describe("#promptWithReaction", () => {
      beforeEach(function (this: ThisTest): void {
         this.badEmoji = jasmine.createSpyObj("Bad emoji", ["hasNameAndId"]);
         (this.badEmoji.hasNameAndId as jasmine.Spy).and.returnValue(false);
         this.goodEmoji = jasmine.createSpyObj("Good emoji", ["hasNameAndId"]);
         (this.goodEmoji.hasNameAndId as jasmine.Spy).and.returnValue(true);

         this.promptOptions = {
            choices: [this.goodEmoji],
            to: "some-channel-or-user",
            message: "Some message.",
         };
         spyOn(this.bot, "sendMessage").and.returnValue(Promise.resolve(this.message));
         spyOn(this.bot, "deleteMessage").and.returnValue(Promise.resolve());
         spyOn(this.bot, "reactTo").and.returnValue(Promise.resolve());

         this.makeReactionEvent = (userId: string): MessageReactionAddRemoveEvent => {
            return {
               message_id: this.message.id,
               emoji: {
                  id: "emoji-id",
                  name: "emoji-name",
               },
               user_id: userId,
            } as any;
         };
         spyOn(this.eventHandler, "listenForReactions").and.callThrough();
      });

      describe("WHEN there is a message", () => {
         it("THEN #sendMessage should be called and the message should be modified", async function (this: ThisTest): Promise<void> {
            this.promptOptions.message = "Some message.";
            (this.bot.sendMessage as jasmine.Spy).and.returnValue(Promise.reject());
            await this.expectPromiseToFail(this.bot.promptWithReaction(this.promptOptions));
            expect(this.bot.sendMessage).toHaveBeenCalledWith(this.promptOptions);
            expect(this.promptOptions.message).toBe("Some message.\n\nReact to answer.");
         });
      });

      describe("WHEN there is no message", () => {
         it("THEN #sendMessage should be called and a message should be added", async function (this: ThisTest): Promise<void> {
            this.promptOptions.message = undefined;
            (this.bot.sendMessage as jasmine.Spy).and.returnValue(Promise.reject());
            await this.expectPromiseToFail(this.bot.promptWithReaction(this.promptOptions));
            expect(this.bot.sendMessage).toHaveBeenCalledWith(this.promptOptions);
            expect(this.promptOptions.message || "NO MESSAGE?! D:").toBe("React to answer.");
         });
      });

      describe("WHEN there is an error while sending the message", () => {
         it("THEN the promise should fail", async function (this: ThisTest): Promise<void> {
            const errorMessage: string = "Could not send the message :c";
            (this.bot.sendMessage as jasmine.Spy).and.returnValue(Promise.reject(new Error(errorMessage)));
            await this.expectPromiseToFail(this.bot.promptWithReaction(this.promptOptions), errorMessage);
         });
      });

      describe("WHEN there is an error while reacting to the message", () => {
         it("THEN the message should be deleted and the promise should fail", async function (this: ThisTest): Promise<void> {
            const errorMessage: string = "Could not react to the message :c";
            (this.bot.reactTo as jasmine.Spy).and.returnValue(Promise.reject(new Error(errorMessage)));
            await this.expectPromiseToFail(this.bot.promptWithReaction(this.promptOptions), errorMessage);
            expect(this.bot.deleteMessage).toHaveBeenCalledWith(this.message);
         });
      });

      describe("WHEN there is no reaction for the set amount of time", () => {
         afterEach(function (): void {
            jasmine.clock().uninstall();
         });

         it("THEN the promise should fail and the message should be deleted", async function (this: ThisTest): Promise<void> {
            jasmine.clock().install();
            this.promptOptions.timeoutMs = 5000;
            (this.eventHandler.listenForReactions as jasmine.Spy).and.callFake(() => {
               jasmine.clock().tick((this.promptOptions.timeoutMs || 0) * 2);
            });

            await this.expectPromiseToFail(this.bot.promptWithReaction(this.promptOptions), "No response in 5000 ms");
            expect(this.bot.deleteMessage).toHaveBeenCalledWith(this.message);
            expect(this.eventHandler.listenForReactions).toHaveBeenCalled();
         });
      });

      describe("WHEN there is a timeout", () => {
         afterEach(function (): void {
            jasmine.clock().uninstall();
         });

         it("THEN the timeout should be removed upon success", async function (this: ThisTest): Promise<void> {
            jasmine.clock().install();
            this.promptOptions.choices = [this.goodEmoji];
            this.promptOptions.timeoutMs = 5000;

            this.eventHandler.prepareReaction(this.message, this.makeReactionEvent("some-user"));
            await this.bot.promptWithReaction(this.promptOptions);
            jasmine.clock().tick(this.promptOptions.timeoutMs * 2);
            expect(this.bot.deleteMessage).not.toHaveBeenCalled();
            expect(this.eventHandler.listenForReactions).toHaveBeenCalled();
         });
      });

      describe("WHEN 'deleteAfterwards' is set to true", () => {
         it("THEN the nessage should be deleted", async function (this: ThisTest): Promise<void> {
            this.promptOptions.choices = [this.goodEmoji];
            this.promptOptions.deleteAfterwards = true;
            this.eventHandler.prepareReaction(this.message, this.makeReactionEvent("some-user"));
            await this.bot.promptWithReaction(this.promptOptions);
            expect(this.bot.deleteMessage).toHaveBeenCalled();
            expect(this.eventHandler.listenForReactions).toHaveBeenCalled();
         });
      });

      it("should work", async function (this: ThisTest): Promise<void> {
         this.promptOptions.choices = [this.badEmoji, this.badEmoji, this.goodEmoji, this.badEmoji];
         const botReaction: MessageReactionAddRemoveEvent = this.makeReactionEvent(this.nativeBot.id);
         const badReaction: MessageReactionAddRemoveEvent = this.makeReactionEvent("bad-user-id");
         const goodReaction: MessageReactionAddRemoveEvent = this.makeReactionEvent("good-user-id");

         this.eventHandler.prepareReaction(this.message, botReaction); // No
         this.eventHandler.prepareReaction(this.message, badReaction); // No
         this.eventHandler.prepareReaction(this.message, goodReaction); // Yes

         this.promptOptions.recipientId = goodReaction.user_id;
         expect(await this.bot.promptWithReaction(this.promptOptions)).toEqual({
            reactionIndex: 2,
            userId: goodReaction.user_id,
         });
         expect(this.timeService.delays).toEqual([200, 200, 200, 200]);
         expect(this.bot.deleteMessage).not.toHaveBeenCalled();
         expect(this.eventHandler.listenForReactions).toHaveBeenCalled();

         expect(this.goodEmoji.hasNameAndId).toHaveBeenCalledTimes(1);
         expect(this.goodEmoji.hasNameAndId).toHaveBeenCalledWith("emoji-name", "emoji-id");
      });
   });
});
