const mongoose = require("mongoose");

const Message = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderName: { type: String, required: true },
  messageType: {
    type: String,
    enum: ["text", "document"],
    default: "text",
  },
  content: { type: String, required: true },
  room: { type: String, required: true, index: true }, // Add room field
  timestamp: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model("Message", Message);
