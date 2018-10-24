import * as Discord from "discord.io";

export class BotMock {
   private readonly mocked: any;

   constructor() {
      this.mocked = {
         sendMessage: jasmine.createSpy("bot#sendMessage"),
         disconnect: jasmine.createSpy("bot#disconnect"),
         connect: jasmine.createSpy("bot#connect"),
      };
   }

   public getMocked(): Discord.Client {
      return this.mocked;
   }
}
