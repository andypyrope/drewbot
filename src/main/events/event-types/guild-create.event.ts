import { Channel, Role } from "discord.io";
import { Emoji, Member, Presence } from "../../discord-types";

export interface GuildCreateEvent {
   void_states: any[];
   verification_level: number;
   unavailable: boolean;
   system_channel_id: any | null;
   splash: any | null;
   roles: Role[];
   region: string;
   presences: Presence[];
   owner_id: string;
   name: string;
   mfa_level: number;
   members: Member[];
   member_count: number;
   lazy: boolean;
   large: boolean;
   /**
    * Timestamp, e.g. 2018-10-20T05:46:04.844915+00:00
    */
   joined_at: string;
   id: string;
   icon: string;
   features: any[];
   explicit_content_filter: number;
   emojis: Emoji[];
   default_message_notifications: number;
   channels: Channel[];
   application_id: any | null;
   afk_timeout: number;
   afk_channel_id: any | null;
}
