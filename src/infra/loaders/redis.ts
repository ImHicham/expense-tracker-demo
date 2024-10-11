import Redis from "ioredis";
import appConfig from "../../config/app";

export default new Redis(appConfig.redisUri, { keyPrefix: "expense_app_" });
