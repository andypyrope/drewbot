import * as logger from "winston";

export class TimeParser {
   private readonly asMs: number;

   constructor(raw: string) {
      this.asMs = NaN;

      if (isNaN(parseFloat(raw))) {
         logger.error("Delay is not a number: " + raw);
      } else if (raw.endsWith("ms")) {
         this.asMs = parseFloat(raw);
      } else if (raw.endsWith("s")) {
         this.asMs = parseFloat(raw) * 1000;
      } else if (raw.endsWith("min")) {
         this.asMs = parseFloat(raw) * 60 * 1000;
      } else if (raw.endsWith("h")) {
         this.asMs = parseFloat(raw) * 60 * 60 * 1000;
      } else {
         logger.error("Invalid delay unit: " + raw);
      }
   }

   public getAsMs(): number {
      return this.asMs;
   }
}
