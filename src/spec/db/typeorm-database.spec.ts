import { Connection, createConnection } from "typeorm";
import { Database } from "../../main/db/database";
import { User } from "../../main/db/entities/user";
import { TypeormDatabase } from "../../main/db/typeorm-database";

interface ThisTest {
   userId: string;
   connection: Connection;
   database: Database;
}

describe("TypeormDatabase", () => {
   beforeEach(async function (this: ThisTest): Promise<void> {
      this.userId = Math.round(Math.random() * 10000000).toString();
      this.connection = await createConnection("test");
      this.database = new TypeormDatabase(this.connection);

      this.connection.manager.clear(User);
   });

   afterEach(async function (this: ThisTest): Promise<void> {
      this.connection.close();
   });

   describe("#fetchTokens", () => {
      describe("WHEN the user does not exist yet", () => {
         it("THEN it should automatically create a new user", async function (this: ThisTest): Promise<void> {
            const tokens: number = await this.database.fetchTokens(this.userId);
            expect(tokens).toBe(0);

            const user: User | undefined = await this.connection.manager.findOne(User, this.userId);
            expect(user).toBeTruthy();
            if (user) {
               expect(user.tokens).toBe(0);
            }
         });
      });

      describe("WHEN the user already exists", () => {
         it("THEN it should fetch the number of tokens and send them", async function (this: ThisTest): Promise<void> {
            const mockUser: User = new User(this.userId);
            mockUser.tokens = 100;
            await this.connection.manager.save(mockUser);
            expect(await this.database.fetchTokens(this.userId)).toBe(mockUser.tokens);
         });
      });
   });

   describe("#giveTokens", () => {
      describe("WHEN the user does not exist yet", () => {
         it("THEN it should automatically create a new user", async function (this: ThisTest): Promise<void> {
            const tokens: number = await this.database.giveTokens(this.userId, 5);
            expect(tokens).toBe(5);

            const user: User | undefined = await this.connection.manager.findOne(User, this.userId);
            expect(user).toBeTruthy();
            if (user) {
               expect(user.tokens).toBe(5);
            }
         });
      });

      describe("WHEN the user already exists", () => {
         it("THEN it should fetch the number of tokens and send them", async function (this: ThisTest): Promise<void> {
            const mockUser: User = new User(this.userId);
            mockUser.tokens = 10;
            await this.connection.manager.save(mockUser);
            expect(await this.database.giveTokens(this.userId, -2)).toBe(8);
            expect((<User> await this.connection.manager.findOne(User, this.userId)).tokens).toBe(8);
         });
      });
   });
});
