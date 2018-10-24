import { CommandParams } from "../../../main/commands/command-params";
import { EmptyCommand } from "../../../main/commands/testing/empty.command";
import { MessageCreateEvent } from "../../../main/events/event-types/message-create.event";
import { BotMock } from "../../mocks/bot.mock";
import { EventHandlerMock } from "../../mocks/event-handler.mock";

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
         this.params = {
            bot: new BotMock().getMocked(),
            command: "",
            parts: [],
            event: <MessageCreateEvent>{},
            channelId: "123",
            authorId: "235",
            eventHandler: new EventHandlerMock().getMocked(),
         };
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
