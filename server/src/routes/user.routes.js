import express from "express";
import {
  getUserStats,
  forgotPassword,
  getProfile,
  login,
  logout,
  registerUser,
  resetPassword,
  verifyUser,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controller/user.controller.js";
import isLoggedIn from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", login);

router.get("/profile", isLoggedIn, getProfile);
router.put("/profile", isLoggedIn, updateProfile);
router.get("/stats", isLoggedIn, getUserStats);
router.get("/logout", isLoggedIn, logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/change-password", isLoggedIn, changePassword);
router.delete("/delete-account", isLoggedIn, deleteAccount);

export default router;
