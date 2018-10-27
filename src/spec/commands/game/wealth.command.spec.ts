import { CommandParams } from "../../../main/commands/command-params";
import { WealthCommand } from "../../../main/commands/game/wealth.command";
import { CommandParamsMock } from "../../mocks/command-params.mock";

interface ThisTest {
   params: CommandParams;
   tokens: number;
}

describe("WealthCommand", () => {
   describe("#getAliases", () => {
      it("should return the correct aliases", function (this: ThisTest): void {
         expect(new WealthCommand().getAliases()).toEqual(["wealth"]);
      });
   });

   describe("#getInfo", () => {
      it("should return the correct information", function (this: ThisTest): void {
         expect(new WealthCommand().getInfo())
            .toBe("Shows the current amount of wealth you have");
      });
   });

   describe("#execute", () => {
      beforeEach(function (this: ThisTest): void {
         this.params = new CommandParamsMock("wealth");
         this.tokens = 10;
         spyOn(this.params.database, "fetchTokens").and.returnValue(Promise.resolve(this.tokens));
      });

      it("should fetch the number of tokens and send them", async function (this: ThisTest): Promise<void> {
         expect(this.params.database.fetchTokens).not.toHaveBeenCalled();
         await new WealthCommand().execute(this.params);

         expect(this.params.database.fetchTokens).toHaveBeenCalledWith(this.params.authorId);
         expect(this.params.bot.sendMessage).toHaveBeenCalledWith({
            to: this.params.channelId,
            message: "<@" + this.params.authorId + ">, you have " + this.tokens + " tokens.",
         });
      });
   });
});
