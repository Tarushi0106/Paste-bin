const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");

// 🔥 TEMP IN-MEMORY STORAGE
let pastes = [];

// Create a new paste
router.post("/pastes", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const expiresAt = ttl_seconds
    ? new Date(Date.now() + ttl_seconds * 1000)
    : null;

  const paste = await Paste.create({
    content,
    expiresAt,
    maxViews: max_views ?? null,
  });

  res.status(201).json({
    id: paste._id.toString(),
    url: `${process.env.PUBLIC_BASE_URL}/p/${paste._id}`
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
router.get("/pastes/:id", async (req, res) => {
  const paste = await Paste.findById(req.params.id);
  if (!paste) return res.status(404).json({ error: "Not found" });

  const currentTime = now(req);

  if (paste.expiresAt && currentTime > paste.expiresAt.getTime()) {
    return res.status(404).json({ error: "Expired" });
  }

  if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
    return res.status(404).json({ error: "View limit exceeded" });
  }

  paste.viewsUsed += 1;
  await paste.save();

  res.json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null ? null : paste.maxViews - paste.viewsUsed,
    expires_at: paste.expiresAt
  });
});


module.exports = router;
