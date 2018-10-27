import { CommandParams } from "../../../main/commands/command-params";
import { SleepCommand } from "../../../main/commands/control/sleep.command";
import { CommandParamsMock } from "../../mocks/command-params.mock";

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
         this.params = new CommandParamsMock("sleep");
      });

      describe("WHEN the author is not a superuser", () => {
         it("THEN it should not allow the command to be executed", async function (this: ThisTest): Promise<void> {
            spyOn(this.params.database, "isSuperuser").and.returnValue(Promise.resolve(false));

            await new SleepCommand().execute(this.params);
            expect(this.params.bot.sendMessage).toHaveBeenCalledWith({
               to: this.params.channelId,
               message: "Not until you've read me a bedtime story, hmph (￣^￣)",
            });
            expect(this.params.bot.disconnect).not.toHaveBeenCalled();
         });
      });

      describe("WHEN the author is a superuser", () => {
         beforeEach(function (this: ThisTest): void {
            spyOn(this.params.database, "isSuperuser").and.returnValue(Promise.resolve(true));
         });
         afterEach(function (this: ThisTest): void {
            expect(this.params.database.isSuperuser).toHaveBeenCalledWith(this.params.authorId);
         });

         describe("WHEN there is no parameter", () => {
            it("THEN it should not do anything", async function (this: ThisTest): Promise<void> {
               await new SleepCommand().execute(this.params);
               expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
               expect(this.params.bot.disconnect).not.toHaveBeenCalled();
            });
         });

         describe("WHEN there is an invalid parameter", () => {
            it("THEN it should not do anything", async function (this: ThisTest): Promise<void> {
               this.params.parts.push("s13ash");
               await new SleepCommand().execute(this.params);
               expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
               expect(this.params.bot.disconnect).not.toHaveBeenCalled();
            });
         });

         describe("WHEN a valid parameter has been set", () => {
            afterEach(function (): void {
               jasmine.clock().uninstall();
            });

            describe("WHEN the bot fails to disconnect", () => {
               it("THEN it should not try to reconnect", async function (this: ThisTest): Promise<void> {
                  jasmine.clock().install();
                  this.params.parts.push("10s");
                  await new SleepCommand().execute(this.params);

                  expect(this.params.bot.disconnect).toHaveBeenCalled();
                  this.params.bot.connected = true;
                  jasmine.clock().tick(9000);

                  jasmine.clock().tick(1001);
                  expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
                  expect(this.params.bot.connect).not.toHaveBeenCalled();
               });
            });

            describe("WHEN the bot successfully disconnects", () => {
               it("THEN it should try to reconnect", async function (this: ThisTest): Promise<void> {
                  jasmine.clock().install();
                  this.params.parts.push("2min");
                  await new SleepCommand().execute(this.params);

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
});
