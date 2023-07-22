const mongoose = require("mongoose");
const logger = require("../utils/logger");

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("DATABASE CONNECTED");
    logger.info({ message: `DATABASE CONNECTED` });
  } catch (error) {
    console.log(error);
    logger.error({ message: `DATABASE CONNECTION FAILED` });
    process.exit(1);
  }
};

module.exports = connectDB;
