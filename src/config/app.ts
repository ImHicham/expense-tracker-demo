import dotenv from "dotenv";
import path from "path";
import fs from "fs";

process.env.NODE_ENV = process.env.NODE_ENV || "dev";
const { NODE_ENV } = process.env;

const envPath =
  NODE_ENV === "test"
    ? path.resolve(__dirname + "/../../.env.test")
    : path.resolve(__dirname + "/../../.env");

const envFileExists = fs.existsSync(envPath);

if (envFileExists && ["dev", "test"].includes(NODE_ENV)) {
  const result = dotenv.config({
    path: envPath,
  });

  if (result.error) {
    throw result.error;
  }
}

const {
  DB_URI,
  JWT_SECRET,
  LOG_LEVEL = "info",

  REDIS_URI,

  PORT = 3000,
} = process.env;

type AppConfig = {
  [key: string]: any;
};

const appConfig: AppConfig = {
  hashSalt: "r4yw2!",
  env: NODE_ENV,
  /**
   * Your favorite port
   */
  //   port: parseInt(PORT as string, 10),
  port: Number(PORT),

  /**
   * That long string from mlab
   */
  databaseURL: DB_URI,

  /**
   * Redis connection string
   */
  redisUri: REDIS_URI,
  /**
   * Identifies each client app which requests JWT
   */
  defaultClientId: "9781",

  /**
   * Duration period for refresh token in seconds, set it to 1 day by default
   */
  refreshTokenDuration: 1 * 24 * 60 * 60,

  /**
   * Your secret sauce for JWT token
   */
  jwtSecret: JWT_SECRET,

  /**
   * Duration period for JWT token in seconds, set it to 8h
   */
  jwtDuration: 8 * 60 * 60,

  /**
   * Used by winston logger
   */
  logs: {
    level: LOG_LEVEL,
  },

  /**
   * API configs
   */
  api: {
    prefix: "/api",
  },
};

export default appConfig;
