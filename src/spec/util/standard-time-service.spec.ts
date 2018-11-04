import { StandardTimeService } from "../../main/util/standard-time-service";

describe("StandardTimeService", () => {
   describe("#wait", () => {
      afterEach(function (): void {
         jasmine.clock().uninstall();
      });

      it("should wait correctly", async function (): Promise<void> {
         jasmine.clock().install();
         const promise: Promise<void> = new StandardTimeService().wait(500);
         jasmine.clock().tick(500);
         await promise;
      });
   });
});
