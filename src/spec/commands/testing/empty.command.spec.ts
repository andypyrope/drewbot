import { CommandParams } from "../../../main/commands/command-params";
import { EmptyCommand } from "../../../main/commands/testing/empty.command";
import { CommandParamsMock } from "../../mocks/command-params.mock";

interface ThisTest {
   params: CommandParams;
}

describe("EmptyCommand", () => {
   describe("#getAliases", () => {
      it("should return the correct aliases", function (): void {
         expect(new EmptyCommand().getAliases()).toEqual([""]);
      });
   });

   describe("#getInfo", () => {
      it("should return the correct information", function (): void {
         expect(new EmptyCommand().getInfo()).toBe("Only replies with an emoji");
      });
   });

   describe("#execute", () => {
      beforeEach(function (this: ThisTest): void {
         this.params = new CommandParamsMock("");
      });

      it("should only send a cute emoticon (for now)", function (this: ThisTest): void {
         new EmptyCommand().execute(this.params);
         expect(this.params.bot.sendMessage).toHaveBeenCalledWith({
            to: this.params.channelId,
            message: "(* >ω<)!",
         });
      });
   });
});
