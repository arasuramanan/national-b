const mongoose = require("mongoose");

const auditTrailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  userName: {
    type: String,
    required: true,
  },

  userEmail: {
    type: String,
    required: true,
  },

  action: {
    type: String,
    enum: [
      "LOGIN",
      "LOGOUT",
      "CREATE_UPSI",
      "EXPORT_EXCEL",
      "EXPORT_PDF",
    ],
    required: true,
  },

  module: {
    type: String,
    enum: ["AUTH", "UPSI", "EXPORT"],
    required: true,
  },

  recordId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },

  ipAddress: {
    type: String,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AuditTrail", auditTrailSchema);