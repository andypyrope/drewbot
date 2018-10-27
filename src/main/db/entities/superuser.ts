import { Column, Entity, PrimaryColumn } from "typeorm";
import { EntityBase } from "../entity-base";

/**
 * Contains just a user ID. Corresponds to the table that is essentially a list of superusers. There
 * is meant to be an extremely low number of superusers so storing a 'isSuperuser' property for each
 * of the many users isn't very efficient.
 */
@Entity({ name: "superusers" })
export class Superuser extends EntityBase {

   constructor(id: string) {
      super();
      this.id = id;
   }

   /**
    * The discord ID of the user.
    */
   @PrimaryColumn({ length: 32 })
   id: string;
}
