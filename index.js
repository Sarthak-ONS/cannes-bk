require("dotenv").config();

const connectDB = require("./services/connectDB.service");
const app = require("./app");
const logger = require("./utils/logger");

const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`App is running on port=${PORT}`);
  logger.info({ message: `APP STARTED ON PORT=${PORT}` });
});
