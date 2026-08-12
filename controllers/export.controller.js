const pdfmake = require("pdfmake");
const Details = require("../models/details.models");
const ExcelJS = require("exceljs");
const path = require("path");

// ================================
// REGISTER PDF FONTS
// ================================

pdfmake.addFonts({
  Roboto: {
    normal: path.join(
      __dirname,
      "../node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf"
    ),
    bold: path.join(
      __dirname,
      "../node_modules/pdfmake/fonts/Roboto/Roboto-Medium.ttf"
    ),
    italics: path.join(
      __dirname,
      "../node_modules/pdfmake/fonts/Roboto/Roboto-Italic.ttf"
    ),
    bolditalics: path.join(
      __dirname,
      "../node_modules/pdfmake/fonts/Roboto/Roboto-MediumItalic.ttf"
    ),
  },
});

// ================================
// PDF EXPORT
// ================================

const exportUPSIToPDF = async (req, res, next) => {
  try {
    const details = await Details.find()
      .sort({ _id: 1 })
      .lean();

    if (!details || details.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data available to export",
      });
    }

    const body = [
      [
        { text: "S.No.", bold: true },
        { text: "Name of UPSI", bold: true },
        { text: "Info Shared By", bold: true },
        { text: "PAN 1", bold: true },
        { text: "Capacity 1", bold: true },
        { text: "Designation 1", bold: true },
        { text: "Info Shared To", bold: true },
        { text: "PAN 2", bold: true },
        { text: "Capacity 2", bold: true },
        { text: "Designation 2", bold: true },
        { text: "Organization Type", bold: true },
        { text: "Organization", bold: true },
        { text: "Date", bold: true },
        { text: "Particular", bold: true },
        { text: "Purpose", bold: true },
        { text: "Mode", bold: true },
        { text: "Time", bold: true },
      ],
    ];

    details.forEach((item, index) => {
      body.push([
        index + 1,
        item.NameoftheUPSI || "",
        item.InfoSharedBy || "",
        item.PANNumber1 || "",
        item.InformationSharedInCapacity1 || "",
        item.Designation1 || "",
        item.InfoSharedTo || "",
        item.PANNumber2 || "",
        item.InformationSharedInCapacity2 || "",
        item.Designation2 || "",
        item.TypeofOrganization || "",
        item.NameoftheOrganization || "",
        item.DateofSharing
          ? new Date(item.DateofSharing)
              .toISOString()
              .split("T")[0]
          : "",
        item.ParticularofInfoShared || "",
        item.PurposeofSharing || "",
        item.ModeofSharing || "",
        item.TimeofSharing || "",
      ]);
    });

    const documentDefinition = {
      pageSize: "A2",
      pageOrientation: "landscape",

      pageMargins: [21, 21, 21, 21],

      content: [
        {
          text: "National Fittings Limited",
          style: "companyName",
        },

        {
          text: "UPSI Details Report",
          style: "reportTitle",
        },

        {
          table: {
            headerRows: 1,

            widths: [
              35,
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
            ],

            body,
          },

          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,

            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 4,
            paddingBottom: () => 4,

            fillColor: (rowIndex) => {
              return rowIndex === 0
                ? "#E5E5E5"
                : null;
            },
          },
        },
      ],

      styles: {
        companyName: {
          alignment: "center",
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 5],
        },

        reportTitle: {
          alignment: "center",
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 20],
        },
      },

      defaultStyle: {
        font: "Roboto",
        fontSize: 7,
      },
    };

    // pdfmake 0.3.x API
    const pdf = pdfmake.createPdf(documentDefinition);

    console.log("PDF generation started");
    console.log("Records:", details.length);

    console.log(
      "Roboto font exists:",
      require("fs").existsSync(
        path.join(
          __dirname,
          "../node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf"
        )
      )
    );

    const pdfBuffer = await pdf.getBuffer();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="UPSI_Details_Report.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error(
      "========== UPSI PDF EXPORT ERROR =========="
    );

    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Full error:", error);

    console.error(
      "============================================"
    );

    return res.status(500).json({
      success: false,
      message: error.message,
      error: error.stack,
    });
  }
};

// ================================
// EXCEL EXPORT
// ================================

const exportUPSIToExcel = async (req, res, next) => {
  try {
    const details = await Details.find()
      .sort({ _id: 1 })
      .lean();

    if (!details || details.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data available to export",
      });
    }

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("UPSI Details");
    console.log("========== UPSI EXCEL VERSION 2 ==========");
    console.log("Using NEW UPSI Excel export code");

    // ================================
    // EXCEL COLUMNS
    // ================================

    worksheet.columns = [
      {
        header: "S.No.",
        key: "serialNumber",
        width: 10,
      },
      {
        header: "Name of UPSI",
        key: "NameoftheUPSI",
        width: 25,
      },
      {
        header: "Info Shared By",
        key: "InfoSharedBy",
        width: 25,
      },
      {
        header: "PAN Number 1",
        key: "PANNumber1",
        width: 20,
      },
      {
        header: "Information Shared In Capacity 1",
        key: "InformationSharedInCapacity1",
        width: 30,
      },
      {
        header: "Designation 1",
        key: "Designation1",
        width: 25,
      },
      {
        header: "Info Shared To",
        key: "InfoSharedTo",
        width: 25,
      },
      {
        header: "PAN Number 2",
        key: "PANNumber2",
        width: 20,
      },
      {
        header: "Information Shared In Capacity 2",
        key: "InformationSharedInCapacity2",
        width: 30,
      },
      {
        header: "Designation 2",
        key: "Designation2",
        width: 30,
      },
      {
        header: "Type of Organization",
        key: "TypeofOrganization",
        width: 25,
      },
      {
        header: "Organization",
        key: "NameoftheOrganization",
        width: 30,
      },
      {
        header: "Date",
        key: "DateofSharing",
        width: 18,
      },
      {
        header: "Particular",
        key: "ParticularofInfoShared",
        width: 30,
      },
      {
        header: "Purpose",
        key: "PurposeofSharing",
        width: 30,
      },
      {
        header: "Mode",
        key: "ModeofSharing",
        width: 20,
      },
      {
        header: "Time",
        key: "TimeofSharing",
        width: 15,
      },
    ];

    // ================================
    // ADD DATA
    // ================================

    details.forEach((item, index) => {
      worksheet.addRow({
        serialNumber: index + 1,

        NameoftheUPSI:
          item.NameoftheUPSI || "",

        InfoSharedBy:
          item.InfoSharedBy || "",

        PANNumber1:
          item.PANNumber1 || "",

        InformationSharedInCapacity1:
          item.InformationSharedInCapacity1 || "",

        Designation1:
          item.Designation1 || "",

        InfoSharedTo:
          item.InfoSharedTo || "",

        PANNumber2:
          item.PANNumber2 || "",

        InformationSharedInCapacity2:
          item.InformationSharedInCapacity2 || "",

        Designation2:
          item.Designation2 || "",

        TypeofOrganization:
          item.TypeofOrganization || "",

        NameoftheOrganization:
          item.NameoftheOrganization || "",

        DateofSharing: item.DateofSharing
          ? new Date(item.DateofSharing)
              .toISOString()
              .split("T")[0]
          : "",

        ParticularofInfoShared:
          item.ParticularofInfoShared || "",

        PurposeofSharing:
          item.PurposeofSharing || "",

        ModeofSharing:
          item.ModeofSharing || "",

        TimeofSharing:
          item.TimeofSharing || "",
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
// TEMPORARY DEBUG LOGS
// ================================

console.log("========== UPSI EXCEL VERSION 2 ==========");
console.log("Using NEW UPSI Excel export code");

console.log(
  "Header bold:",
  worksheet.getRow(1).font.bold
);

console.log(
  "Header fill:",
  worksheet.getRow(1).fill.fgColor.argb
);

console.log(
  "Header alignment:",
  worksheet.getRow(1).alignment.horizontal
);

console.log(
  "First column header:",
  worksheet.getColumn(1).header
);

console.log("==========================================");

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
      'attachment; filename="UPSI_Details_Report.xlsx"'
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error(
      "UPSI Excel Export Error:",
      error
    );

    next(error);
  }
};

// ================================
// EXPORTS
// ================================

module.exports = {
  exportUPSIToPDF,
  exportUPSIToExcel,
};