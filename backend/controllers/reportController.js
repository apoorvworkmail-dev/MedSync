const Report = require("../models/Reports");
const path = require("path");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const askGemini = require("../services/geminiServices");

// Get All Reports
const getReports = async (req, res) => {
  try {
    console.log("GET /api/reports called - headers:", req.headers);
    const reports = await Report.find();

    res.status(200).json({
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Add Report
const createReport = async (req, res) => {
  try {
    const { patientName, reportType, department, status, reportDate, title, category, generatedBy } = req.body;

    const report = await Report.create({
      patientName: patientName || "Unknown Patient",
      reportType: reportType || title || "General Report",
      department: department || category || "General",
      status: status || "Pending",
      reportDate: reportDate || new Date(),
      title: title || reportType || "General Report",
      category: category || department || "General",
      generatedBy: generatedBy || req.user?.id,
    });

    res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateReport = async (req, res) => {
  try {

    const report =
      await Report.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.status(200).json(report);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Only allow the owner of the report to delete it
    if (report.generatedBy && report.generatedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this report",
      });
    }

    // Delete the file from filesystem if it exists
    if (report.fileUrl) {
      const filePath = path.resolve(report.fileUrl);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file from disk:", err);
        } else {
          console.log("File deleted from disk:", filePath);
        }
      });
    }

    await report.deleteOne();

    res.status(200).json({
      message: "Report deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const uploadReport = async (req, res) => {
  try {
    const report = await Report.create({
      patientName: req.body.patientName,
      reportName: req.body.reportName,
      reportType: req.body.reportType,
      department: req.body.department,
      generatedBy: req.user.id,
      fileUrl: req.file
        ? req.file.path.replace(/\\/g, "/")
        : "",
    });

    let summary = "";

    if (
      req.file &&
      req.file.mimetype === "application/pdf"
    ) {
      try {
        const pdfBuffer =
          fs.readFileSync(req.file.path);

        const parser = new PDFParse({ data: pdfBuffer });

        const pdfData =
          await parser.getText();

        await parser.destroy();

        const extractedText =
          pdfData.text.slice(0, 8000);

        const prompt = `
You are a medical report assistant.

Analyze this report.

Explain findings in simple language.

Do NOT diagnose.

Do NOT claim certainty.

Keep answer under 150 words.

Medical Report:

${extractedText}
`;

        summary =
          await askGemini(prompt);

      } catch (error) {
        console.log(
          "PDF Summary Error:",
          error.message
        );

        summary =
          "AI summary is temporarily unavailable. Please try again later.";
      }
    }

    if (summary) {
      report.aiSummary = summary;
      await report.save();
    }

    res.status(201).json({
      success: true,
      report,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyReports = async (req, res) => {
  try {

    const reports = await Report.find({
      generatedBy: req.user.id,
    });

    res.status(200).json(reports);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const downloadReport = async (req, res) => {
  try {

    const report = await Report.findById(
      req.params.id
    );

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (!report.fileUrl) {
      return res.status(400).json({
        message: "This report does not have an associated file to download",
      });
    }

    const absolutePath = path.resolve(report.fileUrl);
    res.download(absolutePath);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getReports,
  createReport,
  updateReport,
  deleteReport,

  uploadReport,
  getMyReports,
  downloadReport,
};