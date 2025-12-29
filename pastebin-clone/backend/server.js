const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const pasteRoutes = require("./routes/pasteRoutes");

// Load environment variables
dotenv.config();

const app = express();

/* =======================
   CORS CONFIG (FIXED)
   ======================= */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://paste-bin-ploi.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

/* =======================
   MIDDLEWARE
   ======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   ROUTES
   ======================= */
app.use("/api", pasteRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

/* =======================
   GLOBAL ERROR HANDLER
   ======================= */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

/* =======================
   MONGODB CONNECTION
   ======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* =======================
   SERVER START
   ======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
});
