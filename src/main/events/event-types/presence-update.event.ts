import { Activity, DetailedActivity, DiscordUser, Presence } from "../../discord-types";

export interface PresenceUpdateEvent extends Presence {
   guild_id: string;
   nick: string | null;
   roles: string[];
}
