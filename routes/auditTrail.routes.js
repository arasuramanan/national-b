const express = require("express");

const { protect } = require("../middleware/auth.middleware");
const {
  getAuditTrails,
  exportAuditTrailToExcel,
} = require("../controllers/auditTrail.controller");

const router = express.Router();

router.get("/audit-trail", protect, getAuditTrails);

router.get("/audit-trail/export/excel", protect, exportAuditTrailToExcel);

module.exports = router;