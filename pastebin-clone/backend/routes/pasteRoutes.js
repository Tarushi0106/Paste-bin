const express = require("express");
const router = express.Router();
const Paste = require("../models/Paste");

function now(req) {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return Number(req.headers["x-test-now-ms"]);
  }
  return Date.now();
}

router.post("/pastes", async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "Invalid content" });
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return res.status(400).json({ error: "Invalid ttl_seconds" });
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return res.status(400).json({ error: "Invalid max_views" });
    }

    const expiresAt = ttl_seconds
      ? new Date(now(req) + ttl_seconds * 1000)
      : null;

    const paste = await Paste.create({
      content,
      expiresAt,
      maxViews: max_views ?? null,
      viewsUsed: 0,
    });

    res.status(201).json({
      id: paste._id.toString(),
      url: `${process.env.FRONTEND_URL}/p/${paste._id}`,
    });
  } catch (err) {
    console.error("Create paste error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/pastes/:id", async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);
    if (!paste) {
      return res.status(404).json({ error: "Not found" });
    }

    const currentTime = now(req);

    if (paste.expiresAt && currentTime > paste.expiresAt.getTime()) {
      return res.status(404).json({ error: "Expired" });
    }

    if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
      return res.status(404).json({ error: "View limit exceeded" });
    }

    paste.viewsUsed += 1;
    await paste.save();

    res.status(200).json({
      content: paste.content,
      remaining_views:
        paste.maxViews === null
          ? null
          : Math.max(0, paste.maxViews - paste.viewsUsed),
      expires_at: paste.expiresAt,
    });
  } catch (err) {
    console.error("Fetch paste error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
