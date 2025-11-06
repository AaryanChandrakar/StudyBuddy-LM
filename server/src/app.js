import express from "express";
import "dotenv/config";
import cors from "cors";
import db from "./utils/db.js";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js";
import notebookRoutes from "./routes/notebook.routes.js";
import contentRoutes from "./routes/content.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 3000;

// Routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/notebooks", notebookRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/chat", chatRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ThinkLM API is running",
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

app.listen(port, () => {
  console.log(`✅ Server is listening at PORT: ${port}`);
  db();
});
