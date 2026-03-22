import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import { APP_CONFIG } from "./config/env.js";
import { configurePassport } from "./config/passport.js";
import { authLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

connectDB();
configurePassport();

// CORS configuration for OAuth and API requests
const FRONTEND_URL = process.env.FRONTEND_URL || "https://mobile-frontend-tau.vercel.app";
const allowedOrigins = [FRONTEND_URL, "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://mobile-frontend-tau.vercel.app"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || 
      origin?.match(/localhost:\d+$/) || 
      origin?.match(/\.loca\.lt$/) || 
      origin?.match(/\.ngrok-free\.app$/) ||
      origin?.match(/\.ngrok\.io$/) ||
      origin?.match(/\.vercel\.app$/) ||
      origin?.match(/\.onrender\.com$/)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Also use the cors package for additional support
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "gadgetra-session-secret-default",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: process.env.NODE_ENV === "production" }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);

// Public Email Debug Endpoint
app.get("/debug/email", async (req, res) => {
  const { testEmailConnection } = await import("./services/emailService.js");
  const { EMAIL_USER, EMAIL_HOST } = await import("./config/env.js");
  
  console.log("Starting manual email debug test...");
  try {
    const success = await testEmailConnection();
    res.json({
      success,
      config: {
        host: EMAIL_HOST || "smtp.gmail.com",
        user: EMAIL_USER ? `${EMAIL_USER.substring(0, 3)}...` : "MISSING",
        port: 465,
        secure: true
      },
      message: success ? "Connection successful!" : "Connection failed - check logs"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err?.message || err);
  if (err?.stack) {
    // eslint-disable-next-line no-console
    console.error(err.stack);
  }
  res.status(err?.statusCode || 500).json({
    message: err?.message || "Internal server error"
  });
});

app.listen(APP_CONFIG.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${APP_CONFIG.port}`);
});

