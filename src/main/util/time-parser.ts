import * as logger from "winston";

export class TimeParser {
   private readonly asMs: number;

   constructor(raw: string, shouldBePositive: boolean = true) {
      this.asMs = NaN;

      if (raw.endsWith("s") && !isNaN(parseFloat(raw.replace("s", "")))) {
         this.asMs = parseFloat(raw.replace("s", "")) * 1000;
      } else if (raw.endsWith("min") && !isNaN(parseFloat(raw.replace("min", "")))) {
         this.asMs = parseFloat(raw.replace("min", "")) * 60 * 1000;
      } else if (raw.endsWith("h") && !isNaN(parseFloat(raw.replace("h", "")))) {
         this.asMs = parseFloat(raw.replace("h", "")) * 60 * 60 * 1000;
      } else {
         logger.error("Invalid delay: " + raw);
      }
   }

   public getAsMs(): number {
      return this.asMs;
   }
}
