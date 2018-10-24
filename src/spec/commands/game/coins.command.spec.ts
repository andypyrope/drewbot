import { CommandParams } from "../../../main/commands/command-params";
import { CoinsCommand } from "../../../main/commands/game/coins.command";
import { MessageCreateEvent } from "../../../main/events/event-types/message-create.event";
import { BotMock } from "../../mocks/bot.mock";
import { EventHandlerMock } from "../../mocks/event-handler.mock";

interface ThisTest {
   params: CommandParams;
}

describe("CoinsCommand", () => {
   describe("#getAliases", () => {
      it("should return the correct aliases", function (): void {
         expect(new CoinsCommand().getAliases()).toEqual(["coins"]);
      });
   });

   describe("#getInfo", () => {
      it("should return the correct information", function (): void {
         expect(new CoinsCommand().getInfo()).toBe("Shows the current number of coins you have");
      });
   });

   describe("#execute", () => {
      beforeEach(function (this: ThisTest): void {
         this.params = {
            bot: new BotMock().getMocked(),
            command: "coins",
            parts: ["coins"],
            event: <MessageCreateEvent>{},
            channelId: "123",
            authorId: "235",
            eventHandler: new EventHandlerMock().getMocked(),
         };
      });

      it("should only send a cute emoticon (for now)", function (this: ThisTest): void {
         new CoinsCommand().execute(this.params);
         expect(this.params.bot.sendMessage).toHaveBeenCalledWith({
            to: this.params.channelId,
            message: "(* >ω<)!",
         });
      });
   });
});
