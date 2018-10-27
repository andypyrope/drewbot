import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class EntityBase {

   /**
    * The moment this entity was created.
    */
   @CreateDateColumn()
   createdOn?: Date;

   /**
    * The last update timestamp of this entity.
    */
   @UpdateDateColumn()
   updatedOn?: Date;
}
