const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Untitled'
    },
    content: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: 'text'
    },
    views: {
      type: Number,
      default: 0
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000
    }
  },
  {
    timestamps: true   // 🔥 THIS LINE FIXES 500 ERROR
  }
);

module.exports = mongoose.model('Paste', pasteSchema);
