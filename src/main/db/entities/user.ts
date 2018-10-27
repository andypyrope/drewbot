import { Column, Entity, PrimaryColumn } from "typeorm";
import { EntityBase } from "../entity-base";

/**
 * Contains information about a single user.
 */
@Entity({ name: "users" })
export class User extends EntityBase {

   constructor(id: string) {
      super();
      this.id = id;
   }

   /**
    * The discord ID of the user.
    */
   @PrimaryColumn({ length: 32 })
   id: string;

   /**
    * How many tokens this user has.
    */
   @Column()
   tokens: number = 0;
}
