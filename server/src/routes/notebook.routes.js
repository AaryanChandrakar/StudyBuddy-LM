import express from "express";
import {
  createNotebook,
  deleteNotebook,
  getNotebook,
  getUserNotebooks,
  updateNotebook,
} from "../controller/notebook.controller.js";
import isLoggedIn from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(isLoggedIn);

router.get("/", getUserNotebooks);
router.post("/", createNotebook);
router.get("/:id", getNotebook);
router.put("/:id", updateNotebook);
router.delete("/:id", deleteNotebook);

export default router;
