import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";

dotenv.config();

export default cleanEnv(process.env, {
  FRONT_END_URL: str(),
  FRONT_END_PORT: port(),
  PORT: port(),
  MONGO_URI: str(),
  JWT_SECRET: str(),
});
