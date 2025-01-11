import * as mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Db ONline");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de inicializar la base de datos");
  }
};
