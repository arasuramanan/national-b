const AuditTrail = require("../models/auditTrail.model");
const User = require("../models/user.model");

const createAuditLog = async ({
  userId,
  action,
  module,
  recordId = null,
  ipAddress = null,
}) => {
  try {
    const user = await User.findById(userId).select("name email");

    if (!user) {
      throw new Error("User not found while creating audit trail");
    }

    const auditLog = await AuditTrail.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      action,
      module,
      recordId,
      ipAddress,
    });

    return auditLog;
  } catch (error) {
    console.error("Audit Trail Error:", error);
    throw error;
  }
};

module.exports = {
  createAuditLog,
};