import * as Discord from "discord.io";
import * as logger from "winston";
import * as fs from "fs";

/**
 * A wrapper of a user.
 */
export class UserInfo {
   private coins: number;

   constructor(
      private readonly userId: string,
      data?: any
   ) {
      this.coins = data ? data.coins : 0;
   }

   public toRawData(): any {
      return {
         "coins": this.coins,
      };
   }
}
