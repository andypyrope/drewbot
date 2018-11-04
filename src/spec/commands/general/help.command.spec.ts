import { CommandHandler } from "../../../main/commands/command-handler";
import { CommandParams } from "../../../main/commands/command-params";
import { HelpCommand } from "../../../main/commands/general/help.command";
import { CommandParamsMock } from "../../mocks/command-params.mock";
import { CommandMock } from "../../mocks/command.mock";

interface ThisTest {
   params: CommandParams;
}

describe("HelpCommand", () => {
   describe("#getAliases", () => {
      it("should return the correct aliases", function (this: ThisTest): void {
         expect(new HelpCommand([]).getAliases()).toEqual(["help"]);
      });
   });

   describe("#getInfo", () => {
      it("should return the correct information", function (this: ThisTest): void {
         expect(new HelpCommand([]).getInfo()).toBe("Shows information about all commands");
      });
   });

   describe("#execute", () => {
      it("should display proper help", function (this: ThisTest): void {
         this.params = new CommandParamsMock("help");
         spyOn(this.params.bot, "sendMessage").and.returnValue(Promise.resolve());
         const allCommands: CommandHandler[] = [
            new CommandMock(["cmd1"], "Some command"),
         ];
         const helpCommand: CommandHandler = new HelpCommand(allCommands);
         allCommands.push(helpCommand);
         allCommands.push(new CommandMock(["cmd2", "cmd2-2"], "Some other...\ncommand"));

         helpCommand.execute(this.params);
         expect(this.params.bot.sendMessage).toHaveBeenCalledWith({
            to: this.params.channelId,
            message: "Commands:\n" +
               " • `cmd1` -- Some command\n" +
               " • `help` -- Shows information about all commands\n" +
               " • `cmd2` | `cmd2-2` -- Some other...\n" +
               "command",
         });
      });
   });
});
