import dotenv from "dotenv";

dotenv.config();

export const {
  PORT,
  NODE_ENV,
  FRONTEND_URL,
  SESSION_SECRET,
  MONGODB_URI,
  MONGO_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
  AUTH_GOOGLE_CALLBACK_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  STRIPE_SECRET_KEY,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS
} = process.env;

export const DATABASE_URI = MONGODB_URI || MONGO_URI;

// Also export the old names for backward compatibility
export const GOOGLE_CLIENT_ID = AUTH_GOOGLE_ID;
export const GOOGLE_CLIENT_SECRET = AUTH_GOOGLE_SECRET;
export const GOOGLE_CALLBACK_URL = AUTH_GOOGLE_CALLBACK_URL;

export const APP_CONFIG = {
  port: PORT || 5000,
  nodeEnv: NODE_ENV || "development",
  frontendUrl: FRONTEND_URL || "https://mobile-frontend-tau.vercel.app",
  sessionSecret: SESSION_SECRET || "gadgetra-session-secret-default",
  jwtExpiresIn: JWT_EXPIRES_IN || "7d"
};
