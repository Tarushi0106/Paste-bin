const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const pasteRoutes = require("./routes/pasteRoutes");

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://paste-bin-ploi.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", pasteRoutes);

app.get("/api/healthz", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });



  const escapeHtml = (str) =>
  str.replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );

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

  res.setHeader("Content-Type", "text/html");
  res.send(`<pre>${escapeHtml(paste.content)}</pre>`);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` API URL: http://localhost:${PORT}/api`);
});

