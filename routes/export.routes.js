const express = require("express");

const {
  exportUPSIToPDF,
  exportUPSIToExcel,
} = require("../controllers/export.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/pdf", protect, exportUPSIToPDF);

router.get("/excel", protect, exportUPSIToExcel);

module.exports = router;