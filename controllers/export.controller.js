const Details = require("../models/details.models");
const puppeteer = require("puppeteer");

// Escape HTML values so special characters in UPSI data
// don't break the generated HTML.
const escapeHtml = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const exportUPSIToPDF = async (req, res, next) => {
  let browser;

  try {
    // Get all UPSI records directly from MongoDB.
    const details = await Details.find()
      .sort({ DateofSharing: -1 })
      .lean();

    if (!details || details.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data available to export",
      });
    }

    // Create table rows using the same fields and order
    // as your existing frontend PDF.
    const tableRows = details
      .map(
        (item) => `
          <tr>
            <td>${escapeHtml(item.NameoftheUPSI)}</td>
            <td>${escapeHtml(item.InfoSharedBy)}</td>
            <td>${escapeHtml(item.PANNumber1)}</td>
            <td>${escapeHtml(item.InformationSharedInCapacity1)}</td>
            <td>${escapeHtml(item.Designation1)}</td>
            <td>${escapeHtml(item.InfoSharedTo)}</td>
            <td>${escapeHtml(item.PANNumber2)}</td>
            <td>${escapeHtml(item.InformationSharedInCapacity2)}</td>
            <td>${escapeHtml(item.Designation2)}</td>
            <td>${escapeHtml(item.TypeofOrganization)}</td>
            <td>${escapeHtml(item.NameoftheOrganization)}</td>
            <td>
              ${
                item.DateofSharing
                  ? new Date(item.DateofSharing)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
            </td>
            <td>${escapeHtml(item.ParticularofInfoShared)}</td>
            <td>${escapeHtml(item.PurposeofSharing)}</td>
            <td>${escapeHtml(item.ModeofSharing)}</td>
            <td>${escapeHtml(item.TimeofSharing)}</td>
          </tr>
        `
      )
      .join("");

    // This reproduces the structure of your current frontend PDF.
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />

          <style>
            @page {
              size: A2 landscape;
              margin: 0.3in;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 0;
              font-family: Arial, Helvetica, sans-serif;
            }

            h2 {
              text-align: center;
              margin-top: 0;
              margin-bottom: 5px;
              font-size: 18px;
            }

            h3 {
              text-align: center;
              margin-top: 0;
              margin-bottom: 20px;
              font-weight: 600;
              font-size: 16px;
            }

            table {
              border-collapse: collapse;
              width: 100%;
              font-size: 10px;
              table-layout: auto;
            }

            th,
            td {
              border: 1px solid #000;
              padding: 4px;
              vertical-align: top;
              word-break: break-word;
              overflow-wrap: break-word;
            }

            th {
              text-align: center;
              background: #e5e5e5;
              font-weight: 600;
            }

            /*
              Repeat the table header on every PDF page.
            */
            thead {
              display: table-header-group;
            }

            /*
              Try to keep each record together.
            */
            tr {
              page-break-inside: avoid;
            }
          </style>
        </head>

        <body>

          <h2>
            National Fittings Limited
          </h2>

          <h3>
            UPSI Details Report
          </h3>

          <table>

            <thead>
              <tr>
                <th>Name of UPSI</th>
                <th>Info Shared By</th>
                <th>PAN 1</th>
                <th>Capacity 1</th>
                <th>Designation 1</th>
                <th>Info Shared To</th>
                <th>PAN 2</th>
                <th>Capacity 2</th>
                <th>Designation 2</th>
                <th>Organization Type</th>
                <th>Organization</th>
                <th>Date</th>
                <th>Particular</th>
                <th>Purpose</th>
                <th>Mode</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              ${tableRows}
            </tbody>

          </table>

        </body>
      </html>
    `;

    // Launch Chromium through Puppeteer.
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    const page = await browser.newPage();

    // A2 landscape viewport.
    await page.setViewport({
      width: 2339,
      height: 1654,
      deviceScaleFactor: 1,
    });

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Generate the PDF.
    const pdfBuffer = await page.pdf({
      format: "A2",
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,

      margin: {
        top: "0.3in",
        right: "0.3in",
        bottom: "0.3in",
        left: "0.3in",
      },
    });

    await browser.close();
    browser = null;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="UPSI_Details_Report.pdf"',
      "Content-Length": pdfBuffer.length,
    });

    return res.send(pdfBuffer);

  } catch (error) {
    console.error("UPSI PDF Export Error:", error);

    if (browser) {
      await browser.close();
    }

    next(error);
  }
};

module.exports = {
  exportUPSIToPDF,
};