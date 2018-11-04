export interface Database {

   /**
    * @param userId The ID of the user.
    * @returns {Promise<number>} The number of tokens this user has.
    */
   fetchTokens(userId: string): Promise<number>;

   /**
    * Gives a specified number of tokens to a user.
    *
    * @param userId The ID of the user.
    * @param tokens The number of tokens to give to the user (can be negative too).
    * @returns {Promise<number>} The new number of tokens this user has.
    */
   giveTokens(userId: string, tokens: number): Promise<number>;
}
