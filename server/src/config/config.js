import { config } from 'dotenv';

config();

export const PORT = process.env.PORT || 3000;
export const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/enrule';
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const AUTH_EMAIL = process.env.AUTH_EMAIL || 'auth_email';
export const AUTH_PASSWORD = process.env.AUTH_PASSWORD;
export const APP_URL = process.env.APP_URL;
export const CLOUD_NAME = process.env.CLOUD_NAME;
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
export const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
