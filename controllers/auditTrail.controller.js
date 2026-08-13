const AuditTrail = require("../models/auditTrail.model");
const ExcelJS = require("exceljs");

// ================================
// GET AUDIT TRAILS
// ================================

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
      const lastRecord =
        auditTrails[auditTrails.length - 1];

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

// ================================
// EXPORT AUDIT TRAIL TO EXCEL
// ================================

const exportAuditTrailToExcel = async (req, res, next) => {
  try {
    const auditTrails = await AuditTrail.find()
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .lean();

    if (!auditTrails || auditTrails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No audit trail data available to export",
      });
    }

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Audit Trail");

    worksheet.columns = [
      {
        header: "S.No.",
        key: "serialNumber",
        width: 10,
      },
      {
        header: "Date & Time",
        key: "createdAt",
        width: 25,
      },
      {
        header: "User Name",
        key: "userName",
        width: 25,
      },
      {
        header: "User Email",
        key: "userEmail",
        width: 35,
      },
      {
        header: "Action",
        key: "action",
        width: 20,
      },
      {
        header: "Module",
        key: "module",
        width: 15,
      },
      {
        header: "Record ID",
        key: "recordId",
        width: 30,
      },
      {
        header: "IP Address",
        key: "ipAddress",
        width: 20,
      },
    ];

    auditTrails.forEach((item, index) => {
      worksheet.addRow({
        serialNumber: index + 1,

    createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
          })
        : "",

        userName: item.userName || "",

        userEmail: item.userEmail || "",

        action: item.action || "",

        module: item.module || "",

        recordId: item.recordId
          ? item.recordId.toString()
          : "",

        ipAddress: item.ipAddress || "",
      });
    });

    // ================================
    // HEADER STYLING
    // ================================

    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
        color: {
      argb: "000000",
  },
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };

    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "E5E5E5",
      },
    };

    headerRow.height = 30;

    // ================================
    // DATA ALIGNMENT
    // ================================

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = {
          vertical: "top",
          wrapText: true,
        };
      }
    });

    // ================================
    // RESPONSE
    // ================================

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Audit_Trail_Report.xlsx"'
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error(
      "Audit Trail Excel Export Error:",
      error
    );

    next(error);
  }
};

// ================================
// EXPORTS
// ================================

module.exports = {
  getAuditTrails,
  exportAuditTrailToExcel,
};