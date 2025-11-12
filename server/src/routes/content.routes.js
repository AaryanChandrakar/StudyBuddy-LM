import express from "express";
import {
  addYoutube,
  addUrl,
  uploadFile,
  addText,
  getContent,
  updateContent,
  deleteContent,
} from "../controller/content.controller.js";
import isLoggedIn from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(isLoggedIn);

router.post("/upload", upload.single("file"), uploadFile);
router.post("/text", addText);
router.post("/url", addUrl);
router.post("/youtube", addYoutube);

// Get single content
router.get("/:id", getContent);

// Update content (title only)
router.put("/:id", updateContent);

router.delete("/:id", deleteContent);

export default router;
