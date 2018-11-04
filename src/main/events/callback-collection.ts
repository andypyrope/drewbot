export interface CallbackCollection<EventType> {
   listen(callback: (event: EventType) => void): number;
}
