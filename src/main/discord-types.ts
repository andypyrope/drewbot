export interface User {
   username: string;
   id: string;
   discriminator: string;
   bot: boolean;
   avatar: string;
}

export interface Member {
   user: User;
   roles: string[];
   nick: string | null;
   mute: boolean;
   joined_at: string;
   deaf: boolean;
}

export interface DetailedUser extends User {
   verified: boolean;
   mfa_enabled: boolean;
   email: string | null;
}

export interface Activity {
   type: number;
   timestamps: { start: number; };
   name: string;
   id: string;
   created_at: number;
}

export interface DetailedActivity extends Activity {
   state: string;
   session_id: string;
   party: {
      size: number[];
      id: string;
   };
   flags: number;
   details: string;
   assets: {
      small_test: string;
      small_image: string;
      large_text: string;
      large_image: string;
   };
   application_id: string;
}

export interface Presence {
   status: "offline" | "online" | "idle";
   user: {
      id: string;
   };
   activities: (Activity | DetailedActivity)[];
   game: Activity | null;
}

export interface Emoji {
   roles: string[];
   require_colons: boolean;
   name: string;
   managed: boolean;
   id: string;
   animated: boolean;
}

export interface PermissionOverwrite {
   type: string;
   id: string;
   deny: number;
   allow: number;
}

export interface Channel {
   type: number;
   topic: any | null;
   rate_limit_per_user: number;
   position: number;
   permission_overwrites: PermissionOverwrite[];
   parent_id: string;
   nsfw: boolean;
   name: string;
   last_message_id: string | null;
   id: string;
}
