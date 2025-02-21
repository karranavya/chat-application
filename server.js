const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const User = require("./models/User");
const Message = require("./models/Message");
require("dotenv").config();

// Connect to MongoDB
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

// Global messages endpoint
app.get("/messages", async (req, res) => {
  try {
    const { room } = req.query;
    if (!room) {
      return res.status(400).json({ message: "Room parameter is required" });
    }

    const messages = await Message.find({ room }).sort({ timestamp: 1 }).lean();

    console.log(`Fetched ${messages.length} messages for room: ${room}`);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// WebSocket Connection
io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send previous messages when user joins a room
  socket.on("joinRoom", async (room) => {
    try {
      socket.join(room);
      console.log(`User joined room: ${room}`);

      const previousMessages = await Message.find({ room })
        .sort({ timestamp: 1 })
        .lean();

      console.log(
        `Messages found for room ${room}: ${previousMessages.length}`
      );
      socket.emit("loadPreviousMessages", previousMessages);
    } catch (err) {
      console.error("Error in joinRoom:", err);
      socket.emit("error", { message: "Failed to load messages" });
    }
  });

  // Handle incoming messages
  socket.on("sendMessage", async (data) => {
    try {
      if (!data.senderName || !data.content || !data.room) {
        console.error("Invalid message data:", data);
        return;
      }

      const newMessage = new Message({
        sender: data.senderId,
        senderName: data.senderName,
        messageType: data.messageType || "text",
        content: data.content,
        room: data.room,
        timestamp: new Date(),
      });

      const savedMessage = await newMessage.save();
      console.log("Message saved:", savedMessage._id);

      io.to(data.room).emit("receiveMessage", {
        ...data,
        _id: savedMessage._id,
        timestamp: savedMessage.timestamp,
      });
    } catch (err) {
      console.error("Error saving message:", err);
      socket.emit("error", { message: "Failed to save message" });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error Handling
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server shutdown complete");
    process.exit(0);
  });
});
