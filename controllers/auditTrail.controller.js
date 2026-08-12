const AuditTrail = require("../models/auditTrail.model");

const getAuditTrails = async (req, res, next) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 20, 1),
      100
    );

    const { createdAt, id } = req.query;

    const query = {};

    // Cursor condition
    if (createdAt && id) {
      query.$or = [
        {
          createdAt: { $lt: new Date(createdAt) },
        },
        {
          createdAt: new Date(createdAt),
          _id: { $lt: id },
        },
      ];
    }

    const auditTrails = await AuditTrail.find(query)
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(limit + 1)
      .lean();

    const hasNext = auditTrails.length > limit;

    if (hasNext) {
      auditTrails.pop();
    }

    let nextCursor = null;

    if (hasNext && auditTrails.length > 0) {
      const lastRecord = auditTrails[auditTrails.length - 1];

      nextCursor = {
        createdAt: lastRecord.createdAt,
        id: lastRecord._id,
      };
    }

    res.status(200).json({
      success: true,
      data: auditTrails,
      pagination: {
        limit,
        hasNext,
        nextCursor,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditTrails,
};