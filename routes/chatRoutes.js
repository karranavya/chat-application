const express = require("express");
const multer = require("multer");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Get Chat Messages
router.get("/messages", authMiddleware, async (req, res) => {
  try {
    const { room } = req.query;
    if (!room) {
      return res.status(400).json({ error: "Room is required" });
    }

    // Explicitly filter by room and sort by timestamp
    const messages = await Message.find({ room }).sort({ timestamp: 1 }).lean();

    console.log(`Fetched ${messages.length} messages for room: ${room}`);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Send a Message
router.post("/send", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { content, messageType, room } = req.body;
    if (!room) {
      return res.status(400).json({ error: "Room is required" });
    }

    const newMessage = new Message({
      sender: req.user.id,
      senderName: req.user.username,
      messageType,
      content,
      room,
      timestamp: new Date(),
    });

    await newMessage.save();
    console.log(`New message saved for room ${room}`);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// Upload Image or Document
router.post("/upload", authMiddleware, upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  res.json({ filePath });
});

module.exports = router;
