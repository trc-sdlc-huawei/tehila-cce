// Load .env file if present
import dotenv from 'dotenv';
dotenv.config();
export const HUAWEI_CCE_AUTH_TOKEN = process.env.HUAWEI_CCE_AUTH_TOKEN;
