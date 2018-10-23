export interface WebSocketEvent {
   /**
    * Detailed data of the event.
    */
   d: any;

   /**
    * UNKNOWN (always 0)
    */
   op: number;

   /**
    * UNKNOWN (varying small integers)
    */
   s: number;

   /**
    * The event type.
    */
   t: string;
}
