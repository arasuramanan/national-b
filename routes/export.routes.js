const express = require("express");

const {
  exportUPSIToPDF,
} = require("../controllers/export.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/pdf", protect, exportUPSIToPDF);

module.exports = router;