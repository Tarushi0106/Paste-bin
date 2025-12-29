const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const pasteRoutes = require("./routes/pasteRoutes");
const Paste = require("./models/Paste");

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "https://paste-bin-ploi.vercel.app",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.options("*", cors());

app.use(express.json());

app.use("/api/pastes", pasteRoutes);


app.get("/api/healthz", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

function now(req) {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return Number(req.headers["x-test-now-ms"]);
  }
  return Date.now();
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );
}

app.get("/p/:id", async (req, res) => {
  const paste = await Paste.findById(req.params.id);
  if (!paste) return res.status(404).send("Not Found");

  const currentTime = now(req);

  if (paste.expiresAt && currentTime > paste.expiresAt.getTime()) {
    return res.status(404).send("Not Found");
  }

  if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
    return res.status(404).send("Not Found");
  }

  paste.viewsUsed += 1;
  await paste.save();

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`<pre>${escapeHtml(paste.content)}</pre>`);
});

app.use((err, req, res, next) => {
  console.error(" Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
