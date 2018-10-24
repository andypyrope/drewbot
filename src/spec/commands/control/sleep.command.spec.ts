import { CommandParams } from "../../../main/commands/command-params";
import { SleepCommand } from "../../../main/commands/control/sleep.command";
import { MessageCreateEvent } from "../../../main/events/event-types/message-create.event";
import { BotMock } from "../../mocks/bot.mock";
import { EventHandlerMock } from "../../mocks/event-handler.mock";

interface ThisTest {
   ownerId: string;
   params: CommandParams;
}

describe("SleepCommand", () => {
   describe("#getAliases", () => {
      it("should return the correct aliases", function (): void {
         expect(new SleepCommand().getAliases()).toEqual(["sleep"]);
      });
   });

   describe("#getInfo", () => {
      it("should return the correct information", function (): void {
         expect(new SleepCommand().getInfo()).toBe("Puts the bot to sleep for some amount of time");
      });
   });

   describe("#execute", () => {
      beforeEach(function (this: ThisTest): void {
         this.ownerId = "258312787422347264";
         this.params = {
            bot: new BotMock().getMocked(),
            command: "sleep",
            parts: ["sleep"],
            event: <MessageCreateEvent>{},
            channelId: "123",
            authorId: this.ownerId,
            eventHandler: new EventHandlerMock().getMocked(),
         };
      });

      describe("WHEN the author ID is incorrect", () => {
         it("THEN it should not allow the command to be executed", function (this: ThisTest): void {
            this.params.authorId = this.ownerId + "2";

            new SleepCommand().execute(this.params);
            expect(this.params.bot.sendMessage).toHaveBeenCalledWith({
               to: this.params.channelId,
               message: "Not until you've read me a bedtime story, hmph (￣^￣)",
            });
            expect(this.params.bot.disconnect).not.toHaveBeenCalled();
         });
      });

      describe("WHEN there is no parameter", () => {
         it("THEN it should not do anything", function (this: ThisTest): void {
            new SleepCommand().execute(this.params);
            expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
            expect(this.params.bot.disconnect).not.toHaveBeenCalled();
         });
      });

      describe("WHEN there is an invalid parameter", () => {
         it("THEN it should not do anything", function (this: ThisTest): void {
            this.params.parts.push("s13ash");
            new SleepCommand().execute(this.params);
            expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
            expect(this.params.bot.disconnect).not.toHaveBeenCalled();
         });
      });

      describe("WHEN a valid parameter has been set", () => {
         afterEach(function (): void {
            jasmine.clock().uninstall();
         });

         describe("WHEN the bot fails to disconnect", () => {
            it("THEN it should not try to reconnect", function (this: ThisTest): void {
               jasmine.clock().install();
               this.params.parts.push("10s");
               new SleepCommand().execute(this.params);

               expect(this.params.bot.disconnect).toHaveBeenCalled();
               this.params.bot.connected = true;
               jasmine.clock().tick(9000);

               jasmine.clock().tick(1001);
               expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
               expect(this.params.bot.connect).not.toHaveBeenCalled();
            });
         });

         describe("WHEN the bot successfully disconnects", () => {
            it("THEN it should try to reconnect", function (this: ThisTest): void {
               jasmine.clock().install();
               this.params.parts.push("2min");
               new SleepCommand().execute(this.params);

               expect(this.params.bot.disconnect).toHaveBeenCalled();
               this.params.bot.connected = false;
               jasmine.clock().tick(100000);

               jasmine.clock().tick(21000);
               expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
               expect(this.params.bot.connect).toHaveBeenCalled();
            });
         });
      });
   });
});
