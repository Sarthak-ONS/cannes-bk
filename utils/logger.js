const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger
const logger = createLogger({
  format: combine(timestamp(), logFormat),
  handleExceptions: true,
  transports: [
    new transports.Console(), // Output logs to the console
    new transports.File({ filename: "logs.log", immediate: true }), // Output logs to a file
  ],
});

module.exports = logger;
