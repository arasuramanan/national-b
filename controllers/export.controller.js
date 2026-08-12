const pdfmake = require("pdfmake");
const Details = require("../models/details.models");

const path = require("path");

// Register fonts
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

const exportUPSIToPDF = async (req, res, next) => {
  try {
    const details = await Details.find()
      .sort({ DateofSharing: -1 })
      .lean();

    if (!details || details.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data available to export",
      });
    }

    const body = [
      [
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

    details.forEach((item) => {
      body.push([
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
          ? new Date(item.DateofSharing).toISOString().split("T")[0]
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
      return rowIndex === 0 ? "#E5E5E5" : null;
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

    const pdfBuffer = await pdf.getBuffer();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="UPSI_Details_Report.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("UPSI PDF Export Error:", error);
    next(error);
  }
};

module.exports = {
  exportUPSIToPDF,
};