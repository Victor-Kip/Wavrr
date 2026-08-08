import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/db.js";
import "./models/album.js";
import "./models/artist.js";
import "./models/associations.js";
import "./models/comment.js";
import "./models/follow.js";
import "./models/like.js";
import "./models/merchandise.js";
import "./models/order.js";
import "./models/orderItem.js";
import "./models/playlist.js";
import "./models/playlistSong.js";
import "./models/post.js";
import "./models/song.js";
import "./models/user.js";
import audioRoutes from "./routes/audioRoutes.js";
import userRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import profileRoutes from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
process.env.PORT = process.env.PORT || 5000;

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Changed to true
app.use(express.json());

// Parse multipart form data (Express 5)
//app.use(express.raw({ type: 'multipart/form-data', limit: '100mb' }));

// CORS middleware - must come BEFORE routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", userRoutes);
app.use("/api/audio/", audioRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", profileRoutes);

sequelize
  .sync({ alter: true })
  .then((result) => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Database sync failed:", error.message);
  });

// Start the server regardless of DB sync
app.listen(process.env.PORT, () => {
  console.log(`Server is up and running on ${process.env.PORT} ...`);
});
