import { TimeParser } from "../../main/util/time-parser";

describe("TimeParser", () => {
   describe("#getAsMs", () => {
      it("should convert hours correctly", function (): void {
         expect(new TimeParser("0.5h").getAsMs()).toBe(1800000);
      });

      it("should convert minutes correctly", function (): void {
         expect(new TimeParser("0.5min").getAsMs()).toBe(30000);
      });

      it("should convert seconds correctly", function (): void {
         expect(new TimeParser("1.5s").getAsMs()).toBe(1500);
      });

      it("should return the correct milliseconds", function (): void {
         expect(new TimeParser("235ms").getAsMs()).toBe(235);
      });

      describe("WHEN the input is invalid", () => {
         it("should return NaN", function (): void {
            expect(new TimeParser("asd3").getAsMs()).toBeNaN();
         });
      });
   });
});
