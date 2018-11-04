import { TimeService } from "../../main/util/time-service";

export class TimeServiceMock implements TimeService {

   public readonly delays: number[] = [];

   wait(delayMs: number): Promise<void> {
      this.delays.push(delayMs);
      return Promise.resolve();
   }
}
