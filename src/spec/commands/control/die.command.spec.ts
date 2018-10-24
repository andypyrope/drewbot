import { CommandParams } from "../../../main/commands/command-params";
import { DieCommand } from "../../../main/commands/control/die.command";
import { MessageCreateEvent } from "../../../main/events/event-types/message-create.event";
import { BotMock } from "../../mocks/bot.mock";
import { EventHandlerMock } from "../../mocks/event-handler.mock";

interface ThisTest {
   ownerId: string;
   params: CommandParams;
}

describe("DieCommand", () => {
   describe("#getAliases", () => {
      it("should return the correct aliases", function (): void {
         expect(new DieCommand().getAliases()).toEqual(["die", "perish", "self-destruct", "kys"]);
      });
   });

   describe("#getInfo", () => {
      it("should return the correct information", function (): void {
         expect(new DieCommand().getInfo()).toBe("Shuts the bot down properly");
      });
   });

   describe("#execute", () => {
      beforeEach(function (this: ThisTest): void {
         this.ownerId = "258312787422347264";
         this.params = {
            bot: new BotMock().getMocked(),
            command: "die",
            parts: ["die"],
            event: <MessageCreateEvent>{},
            channelId: "123",
            authorId: this.ownerId,
            eventHandler: new EventHandlerMock().getMocked(),
         };
      });

      describe("WHEN the author ID is incorrect", () => {
         it("THEN it should not allow the command to be executed", function (this: ThisTest): void {
            this.params.authorId = this.ownerId + "2";

            new DieCommand().execute(this.params);
            expect(this.params.bot.sendMessage).toHaveBeenCalledWith({
               to: this.params.channelId,
               message: "How dare you... :shiba-heartbroken:",
            });
            expect(this.params.bot.disconnect).not.toHaveBeenCalled();
         });
      });

      describe("WHEN there is no parameter", () => {
         it("THEN it should disconnect the bot immediately", function (this: ThisTest): void {
            new DieCommand().execute(this.params);
            expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
            expect(this.params.bot.disconnect).toHaveBeenCalled();
         });
      });

      describe("WHEN there is an invalid parameter", () => {
         it("THEN it should not do anything", function (this: ThisTest): void {
            this.params.parts.push("-3h");
            new DieCommand().execute(this.params);
            expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
            expect(this.params.bot.disconnect).not.toHaveBeenCalled();
         });
      });

      describe("WHEN a valid parameter has been set", () => {
         afterEach(function (): void {
            jasmine.clock().uninstall();
         });

         it("THEN it should disconnect the bot after the specified amount of time", function (this: ThisTest): void {
            jasmine.clock().install();
            this.params.parts.push("0.2h"); // 0.2 * 60 * 60 * 1000 = 720000
            new DieCommand().execute(this.params);

            jasmine.clock().tick(710000);
            expect(this.params.bot.disconnect).not.toHaveBeenCalled();

            jasmine.clock().tick(10001);
            expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
            expect(this.params.bot.disconnect).toHaveBeenCalled();
         });
      });
   });
});
