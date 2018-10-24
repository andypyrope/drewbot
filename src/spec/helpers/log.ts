import { TransformableInfo } from "logform";
import * as logger from "winston";

const opts: any = {
   colorize: true,
   silent: true,
};

logger.configure({
   level: "silly",
   transports: [
      new logger.transports.Console(opts)
   ],
   format: logger.format.combine(
      logger.format.colorize(),
      logger.format.timestamp(),
      logger.format.printf((info: TransformableInfo) => {
         return `${info.timestamp} [${info.level}] ${info.message}`;
      })
   ),
});
