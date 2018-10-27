import { CommandParams } from "../../../main/commands/command-params";
import { DieCommand } from "../../../main/commands/control/die.command";
import { CommandParamsMock } from "../../mocks/command-params.mock";

interface ThisTest {
   superuserId: string;
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
         this.params = new CommandParamsMock("die");
      });

      describe("WHEN the author is not a superuser", () => {
         it("THEN it should not allow the command to be executed", async function (this: ThisTest): Promise<void> {
            spyOn(this.params.database, "isSuperuser").and.returnValue(Promise.resolve(false));
            await new DieCommand().execute(this.params);
            expect(this.params.database.isSuperuser).toHaveBeenCalledWith(this.params.authorId);
            expect(this.params.bot.sendMessage).toHaveBeenCalledWith({
               to: this.params.channelId,
               message: "How dare you... :shiba-heartbroken:",
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
            it("THEN it should disconnect the bot immediately", async function (this: ThisTest): Promise<void> {
               await new DieCommand().execute(this.params);
               expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
               expect(this.params.bot.disconnect).toHaveBeenCalled();
            });
         });

         describe("WHEN there is an invalid parameter", () => {
            it("THEN it should not do anything", async function (this: ThisTest): Promise<void> {
               this.params.parts.push("-3h");
               await new DieCommand().execute(this.params);
               expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
               expect(this.params.bot.disconnect).not.toHaveBeenCalled();
            });
         });

         describe("WHEN a valid parameter has been set", () => {
            afterEach(function (): void {
               jasmine.clock().uninstall();
            });

            it("THEN it should disconnect the bot after the specified amount of time", async function (this: ThisTest): Promise<void> {
               jasmine.clock().install();
               this.params.parts.push("0.2h"); // 0.2 * 60 * 60 * 1000 = 720000
               await new DieCommand().execute(this.params);

               jasmine.clock().tick(710000);
               expect(this.params.bot.disconnect).not.toHaveBeenCalled();

               jasmine.clock().tick(10001);
               expect(this.params.bot.sendMessage).not.toHaveBeenCalled();
               expect(this.params.bot.disconnect).toHaveBeenCalled();
            });
         });
      });
   });
});
