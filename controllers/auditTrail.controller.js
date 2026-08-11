const AuditTrail = require("../models/auditTrail.model");

const getAuditTrails = async (req, res, next) => {
  try {
    const auditTrails = await AuditTrail.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: auditTrails,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditTrails,
};