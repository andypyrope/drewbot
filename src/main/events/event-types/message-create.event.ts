import { User } from "../../discord-types";

export interface ServerMemberInfo {
   roles: string[];
   nick: string | null;
   mute: boolean;
   joined_at: string;
   deaf: boolean;
}

export interface Embed {
   type: string;
   footer: {
      type: string;
   };
   description: string;
   color: number;
   author: {
      proxy_icon_url: string;
      name: string;
      icon_url: string;
   };
}

export interface Attachment {
   width: number;
   url: string;
   size: number;
   proxy_url: string;
   id: string;
   height: number;
   filename: string;
}

export interface MessageCreateEvent {
   type: number;
   tts: boolean;
   timestamp: string;
   pinned: boolean;
   nonce: any;
   mentions: User[];
   mention_roles: string[];
   mention_everyone: boolean;
   member?: ServerMemberInfo;
   id: string;
   embeds: Embed[];
   edited_timestamp: string | null;
   content: string;
   channel_id: string;
   author: User;
   attachments: Attachment[];
}
