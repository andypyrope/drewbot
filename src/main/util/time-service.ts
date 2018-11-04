export interface TimeService {
   /**
    * Waits for a set amount of time, after which its promise is resolved.
    *
    * @param delayMs The number of milliseconds to wait for.
    */
   wait(delayMs: number): Promise<void>;
}
