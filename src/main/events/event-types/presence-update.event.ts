import { Activity, DetailedActivity, Presence, User } from "../../discord-types";

export interface PresenceUpdateEvent extends Presence {
   guild_id: string;
   nick: string | null;
   roles: string[];
}
