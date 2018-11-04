import { CommandParams } from "../../../main/commands/command-params";
import { GetTokenCommand } from "../../../main/commands/game/get-token.command";
import { CommandParamsMock } from "../../mocks/command-params.mock";

interface ThisTest {
   params: CommandParams;
   newTokens: number;
}

describe("GetTokenCommand", () => {
   describe("#getAliases", () => {
      it("should return the correct aliases", function (this: ThisTest): void {
         expect(new GetTokenCommand().getAliases()).toEqual(["get-token"]);
      });
   });

   describe("#getInfo", () => {
      it("should return the correct information", function (this: ThisTest): void {
         expect(new GetTokenCommand().getInfo()).toBe("Gives you a single token");
      });
   });

   describe("#execute", () => {
      beforeEach(function (this: ThisTest): void {
         this.params = new CommandParamsMock("get-token");
         spyOn(this.params.bot, "sendMessage").and.returnValue(Promise.resolve());
      });

      afterEach(function (this: ThisTest): void {
         expect(this.params.database.giveTokens).toHaveBeenCalledWith(this.params.authorId, 1);
      });

      it("should fetch the number of tokens and send them", async function (this: ThisTest): Promise<void> {
         this.newTokens = 10;
         spyOn(this.params.database, "giveTokens").and.returnValue(Promise.resolve(this.newTokens));
         await new GetTokenCommand().execute(this.params);
         expect(this.params.bot.sendMessage).toHaveBeenCalledWith({
            to: this.params.channelId,
            message: "(* >ω<) Done! Now you have " + this.newTokens + " tokens.",
         });
      });

      describe("WHEN there is only one token", () => {
         it("THEN the message should still be correct", async function (this: ThisTest): Promise<void> {
            this.newTokens = 1;
            spyOn(this.params.database, "giveTokens").and.returnValue(Promise.resolve(this.newTokens));
            await new GetTokenCommand().execute(this.params);
            expect(this.params.bot.sendMessage).toHaveBeenCalledWith({
               to: this.params.channelId,
               message: "(* >ω<) Done! Now you have " + this.newTokens + " token.",
            });
         });
      });
   });
});
