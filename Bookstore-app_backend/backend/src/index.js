import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./lib/db.js";

const app = express();

// Middleware
app.use(cors({
  origin: "*",           // allows React Native + Web + any client
  credentials: false,    // must be false when origin is "*"
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" })); // ✅ increased limit for base64 images
app.use(cookieParser());

// Create HTTP Server
const server = http.createServer(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err);
  });