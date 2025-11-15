import express from "express";
import { queryDocuments } from "../controller/chat.controller.js";
import isLoggedIn from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/query", isLoggedIn, queryDocuments);

export default router;
