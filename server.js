import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cron from "node-cron";

import errorHandler from "./src/middlewares/errorHandler.js";
import Site from "./src/models/site.model.js";
import authRoutes from "./src/routes/auth.routes.js";
import siteRoutes from "./src/routes/site.routes.js";
import spendingRoutes from "./src/routes/spending.routes.js";
import fundRoutes from "./src/routes/fund.routes.js";
import reportRoutes from "./src/routes/report.routes.js";

dotenv.config();

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

const app = express();

// ✅ Load allowed CORS origins from .env
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : [];

// ✅ Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow requests like Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/spendings", spendingRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/reports", reportRoutes);

// ✅ Global error handler
app.use(errorHandler);

// ✅ Cron job — runs daily at 2 AM
cron.schedule("0 2 * * *", async () => {
  try {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const result = await Site.deleteMany({
      status: "inactive",
      deletedAt: { $lte: cutoffDate },
    });

    if (result.deletedCount > 0) {
      console.log(
        `🧹 Cleanup: Deleted ${result.deletedCount} old inactive sites`
      );
    }
  } catch (error) {
    console.error("❌ Error running site cleanup job:", error);
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
