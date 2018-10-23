export interface MessageReactionAddEvent {
   channel_id: string;
   emoji: {
      animated: boolean;
      id: string;
      name: string;
   };
   guild_id: string;
   message_id: string;
   user_id: string;
}
