import { DiscordUser } from "../../discord-types";

export interface TypingStartEvent {
   user_id: string;
   timestamp: number;
   member: {
      user: DiscordUser;
      roles: string[];
      nick: string | null;
      mute: boolean;
      joined_at: string;
      deaf: boolean;
   };
   channel_id: string;
   guild_id: string;
}
