import { TimeService } from "./time-service";

export class StandardTimeService implements TimeService {
   public wait(delayMs: number): Promise<void> {
      return new Promise((resolve: () => void): void => {
         setTimeout(resolve, delayMs);
      });
   }
}
