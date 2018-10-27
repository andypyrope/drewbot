import { Database } from "../../main/db/database";

export class DatabaseMock implements Database {
   fetchTokens(): Promise<number> {
      throw new Error("fetchTokens should be spied upon");
   }

   giveTokens(): Promise<number> {
      throw new Error("giveTokens should be spied upon");
   }

   isSuperuser(): Promise<boolean> {
      throw new Error("isSuperuser should be spied upon");
   }
}
