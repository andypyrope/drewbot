import { DetailedUser } from "../../discord-types";

export interface ReadyEvent {
   v: number;
   user_settings: any;
   user: DetailedUser;
   session_id: string;
   relationships: any[];
   private_channels: any[];
   presences: any[];
   guilds: {
      unavailable: boolean;
      id: string;
   }[];
   _trace: string[];
}
