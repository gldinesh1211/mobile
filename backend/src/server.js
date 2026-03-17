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
const allowedOrigins = [FRONTEND_URL, "http://localhost:3000", "http://localhost:3001", "https://gadgetra-frontend.onrender.com", "https://mobile-frontend-tau.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "https://mobile-frontend-tau.vercel.app", 
        "https://neoformative-glenda-myologic.ngrok-free.dev",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002"
      ];
      
      if (allowedOrigins.includes(origin) || 
          origin.match(/localhost:\d+$/) || 
          origin.match(/\.loca\.lt$/) || 
          origin.match(/\.ngrok-free\.app$/) ||
          origin.match(/\.ngrok\.io$/) ||
          origin.match(/\.vercel\.app$/)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

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

