import { EventHandler } from "../../main/events/event-handler";

export class EventHandlerMock {
   private readonly mocked: any;

   constructor() {
   }

   public getMocked(): EventHandler {
      return this.mocked;
   }
}
