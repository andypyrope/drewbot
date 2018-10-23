import * as Discord from "discord.io";
import * as logger from "winston";
import * as fs from "fs";
import { UserInfo } from "./user-info";

/**
 * A wrapper of a server, containing extra information that is server-local.
 *
 * When initialized, it is automatically loaded from a data file if such exists.
 */
export class ServerInfo {
   private static readonly DATA_DIR_PATH: string = "./data/";
   private readonly filePath: string;

   private readonly users: {[userId: string]: UserInfo} = {};

   constructor(private readonly server: Discord.Server) {
      if (!fs.existsSync(ServerInfo.DATA_DIR_PATH)) {
         fs.mkdirSync(ServerInfo.DATA_DIR_PATH);
      }
      this.filePath = ServerInfo.DATA_DIR_PATH + server.id + ".json";
      if (fs.existsSync(this.filePath)) {
         this.load();
      } else {
         for (const userId in server.members) {
            this.users[userId] = new UserInfo(userId);
         }
      }
   }

   private load(): void {
      const rawData: any = JSON.parse(fs.readFileSync("auth.json", "utf8"));
      for (const userId in rawData.users) {
         this.users[userId] = new UserInfo(userId, rawData.users[userId]);
      }
   }

   public save(): void {
      const data: any = {};
      data.users = {};
      for (const userId in this.users) {
         data.users[userId] = this.users[userId].toRawData();
      }
      fs.writeFileSync(this.filePath, data);
   }
}
