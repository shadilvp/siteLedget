import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
// import companyRoutes from "./routes/company.routes.js";
import siteRoutes from "./routes/site.routes.js";
import spendingRoutes from "./routes/spending.routes.js";
import fundRoutes from "./routes/fund.routes.js";
import reportRoutes from "./routes/report.routes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));
const app = express();

// Middleware
app.use(cors());
app.use(express.json());




// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/companies", companyRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/spendings", spendingRoutes); 
app.use("/api/funds", fundRoutes);
app.use("/api/reports", reportRoutes);


app.use(errorHandler);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
