import dotenv from "dotenv";
import sequelize from "../config/db.js";
import "../models/associations.js";

dotenv.config();

const run = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("UUID-only schema created. All numeric IDs were removed.");
  } catch (error) {
    console.error("UUID-only schema reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

run();
