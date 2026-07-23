const express = require("express");

const {
  signup,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * Public Routes
 */
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);

/**
 * Protected Routes
 */
router.post("/logout", protect, logout);
router.get("/me", protect, getCurrentUser);

module.exports = router;