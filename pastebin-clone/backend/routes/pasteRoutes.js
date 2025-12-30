const express = require("express");
const router = express.Router();
const Paste = require("../models/Paste");

/* CREATE PASTE */
router.post("/", async (req, res) => {
  try {
    const { content, title, language } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Content required" });
    }

    const paste = await Paste.create({
      title: title || "Untitled",
      content,
      language: language || "text",
      viewsUsed: 0,
    });

    res.status(201).json({
      success: true,
      data: paste,
      url: `${process.env.FRONTEND_URL}/paste/${paste._id}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* GET RECENT PASTES */
router.get("/pastes", async (req, res) => {

  try {
    const pastes = await Paste.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: pastes
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


/* GET SINGLE PASTE */
router.get("/:id", async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);
    if (!paste) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    paste.viewsUsed += 1;
    await paste.save();

    res.json({
      success: true,
      data: paste
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
