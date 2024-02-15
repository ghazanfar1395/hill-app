import winston from "winston";
import fs from "fs";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import { timeStamp } from "console";

let dir = "./public/logs";
if (!dir) dir = path.resolve("log");

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

const logLevel = "warn";
const errorLogLevel = "error";
const logFileName = `${new Date().getFullYear()}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`;

const options = {
  file: {
    level: "info",
    filename: dir + "/%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: true,
    maxSize: "20m",
    colorize: true,
    maxFiles: "14d",
  },
};

const Logger = winston.createLogger({
  transports: [
    // Print exception in console
    new winston.transports.Console({
      level: logLevel,
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.prettyPrint()
      ),
    }),
    // Write caught exceptions in log file: file location: /public/logs/YYYY-MM-DD.log
    new winston.transports.File({
      level: errorLogLevel,
      filename: dir + `/${logFileName}.log`,
    }),
  ],
  exceptionHandlers: [new DailyRotateFile(options.file)], // For uncaught exception: file will be created. file location: public/logs/yyyy-MM-DD.log
  exitOnError: false, // do not exit on handled exceptions
});
export default Logger;
