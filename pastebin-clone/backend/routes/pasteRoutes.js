const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");

// 🔥 TEMP IN-MEMORY STORAGE
let pastes = [];

// Create a new paste
router.post("/pastes", (req, res) => {
  const { title, content, language } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Content is required"
    });
  }

  const paste = {
    _id: randomUUID(),
    title: title || "Untitled",
    content,
    language: language || "text",
    views: 0,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };

  pastes.unshift(paste);

 
const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://paste-bin-ploi.vercel.app"
    : "http://localhost:3000";

res.status(201).json({
  success: true,
  data: paste,
  url: `${baseUrl}/paste/${paste._id}`
});


  });


// Get recent pastes
router.get("/pastes", (req, res) => {
  res.json({
    success: true,
    data: pastes.slice(0, 10).map(p => ({
      _id: p._id,
      title: p.title,
      language: p.language,
      createdAt: p.createdAt,
      views: p.views
    }))
  });
});

// Get paste by ID
router.get("/pastes/:id", (req, res) => {
  const paste = pastes.find(p => p._id === req.params.id);

  if (!paste) {
    return res.status(404).json({
      success: false,
      message: "Paste not found"
    });
  }

  paste.views += 1;

  res.json({
    success: true,
    data: paste
  });
});

module.exports = router;
