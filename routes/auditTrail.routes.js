const express = require("express");

const { protect } = require("../middleware/auth.middleware");
const {
  getAuditTrails,
} = require("../controllers/auditTrail.controller");

const router = express.Router();

router.get("/audit-trail", protect, getAuditTrails);

module.exports = router;