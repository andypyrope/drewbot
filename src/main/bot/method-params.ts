import { PresetEmoji } from "./preset-emoji";

// Native types

export type SendMessageOptions = {
   /**
    * The channel/user ID to send the message to.
    */
   to: string,

   /**
    * The contents of the message.
    */
   message?: string,
   tts?: boolean,
   nonce?: string,

   /**
    * Simulate typing for a short while (a few seconds) before actually sending the message.
    */
   typing?: boolean,

   /**
    * Additional options to embed content into the message.
    */
   embed?: EmbedMessageOptions
};

export type EmbedMessageOptions = {
   author?: {
      icon_url?: string,
      name: string,
      url?: string
   },
   color?: number,
   description?: string,
   fields?: [{
      name: string,
      value?: string,
      inline?: boolean
   }],
   thumbnail?: {
      url: string
   },
   title: string,
   timestamp?: Date
   url?: string,
   footer?: {
      icon_url?: string,
      text: string
   }
};

export type UploadFileOptions = {
   to: string,
   file: string | Buffer,
   filename?: string,
   message?: string
};

// Custom/advanced types

export type PromptOptions = SendMessageOptions & {
   /**
    * A list of available reactions.
    */
   choices: PresetEmoji[],

   /**
    * Whether the message should be deleted once a reaction has been received.
    */
   deleteAfterwards?: boolean,

   /**
    * The timeout after which the message is destroyed if no reaction has been received.
    */
   timeoutMs?: number,

   /**
    * The ID of the user allowed to answer. If none, then everyone except the bot is allowed.
    */
   recipientId?: string,
};

