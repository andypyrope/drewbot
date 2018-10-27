import { Connection, createConnection, EntityManager } from "typeorm";
import * as logger from "winston";
import { Database } from "./database";
import { Superuser } from "./entities/superuser";
import { User } from "./entities/user";

/**
 * A class that abstracts the exact DB connection away from the rest of the app.
 */
export class TypeormDatabase implements Database {

   private static readonly DEFAULT_DATABASE: string = "development";

   private readonly entityManager: EntityManager;

   constructor(connection: Connection) {
      this.entityManager = connection.manager;
   }

   public async fetchTokens(userId: string): Promise<number> {
      return (await this.getOrCreateUser(userId)).tokens;
   }

   public async giveTokens(userId: string, tokens: number): Promise<number> {
      const user: User = await this.getOrCreateUser(userId);
      user.tokens += tokens;
      return (await this.entityManager.save(user)).tokens;
   }

   public async isSuperuser(userId: string): Promise<boolean> {
      return !!(await this.entityManager.findOne(Superuser, userId));
   }

   private async getOrCreateUser(id: string): Promise<User> {
      const foundUser: User | undefined = await this.entityManager.findOne(User, id);
      if (foundUser) {
         return foundUser;
      }

      logger.info("Could not find user with ID '" + id + "'. Creating it...");
      const userToAdd: User = new User(id);
      await this.entityManager.save(userToAdd);
      return userToAdd;
   }

   public static async initialize(databaseName: string = TypeormDatabase.DEFAULT_DATABASE): Promise<TypeormDatabase> {
      logger.info("Initializing the '" + databaseName + "' database connection");

      try {
         const connection: Connection = await createConnection(databaseName);
         return new TypeormDatabase(connection);
      } catch (error) {
         logger.error("A connection to the '" + databaseName +
            "' database could not be created due to the following error:");
         logger.error(error);
         throw error;
      }
   }
}
