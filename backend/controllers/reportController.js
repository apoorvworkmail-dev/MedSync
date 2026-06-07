const mongoose = require("mongoose");
const Report = require("../models/Reports");

const VALID_STATUSES = ["draft", "published", "archived"];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeStatus = (status) => {
  if (typeof status !== "string") {
    return status;
  }

  return status.toLowerCase().trim();
};

const validateReportInput = ({ title, category, description, status, data } = {}) => {
  if (!title || !category) {
    return "Report title and category are required";
  }

  if (
    typeof title !== "string" ||
    typeof category !== "string" ||
    (description !== undefined && typeof description !== "string")
  ) {
    return "Report title, category, and description must be text values";
  }

  if (!title.trim() || !category.trim()) {
    return "Report title and category cannot be empty";
  }

  if (status !== undefined && !VALID_STATUSES.includes(normalizeStatus(status))) {
    return "Status must be draft, published, or archived";
  }

  if (data !== undefined && (data === null || typeof data !== "object" || Array.isArray(data))) {
    return "Report data must be an object";
  }

  return null;
};

const validateReportUpdateInput = (body = {}) => {
  if (Object.keys(body).length === 0) {
    return "At least one field is required";
  }

  const { title, category, description, status, data } = body;

  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    return "Report title must be a non-empty text value";
  }

  if (category !== undefined && (typeof category !== "string" || !category.trim())) {
    return "Report category must be a non-empty text value";
  }

  if (description !== undefined && typeof description !== "string") {
    return "Report description must be a text value";
  }

  if (status !== undefined && !VALID_STATUSES.includes(normalizeStatus(status))) {
    return "Status must be draft, published, or archived";
  }

  if (data !== undefined && (data === null || typeof data !== "object" || Array.isArray(data))) {
    return "Report data must be an object";
  }

  return null;
};

const buildReportPayload = ({ title, category, description, status, data }, user) => ({
  title: title.trim(),
  category: category.trim(),
  description: typeof description === "string" ? description.trim() : "",
  status: normalizeStatus(status) || "draft",
  generatedBy: user.id,
  data: data || {},
});

const buildReportUpdatePayload = (body) => {
  const payload = {};

  if (body.title !== undefined) {
    payload.title = body.title.trim();
  }

  if (body.category !== undefined) {
    payload.category = body.category.trim();
  }

  if (body.description !== undefined) {
    payload.description = body.description.trim();
  }

  if (body.status !== undefined) {
    payload.status = normalizeStatus(body.status);
  }

  if (body.data !== undefined) {
    payload.data = body.data;
  }

  return payload;
};

const createReport = async (req, res) => {
  try {
    const validationError = validateReportInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const report = await Report.create(buildReportPayload(req.body, req.user));
    const populatedReport = await report.populate("generatedBy", "name email");

    res.status(201).json({
      message: "Report created successfully",
      report: populatedReport,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("generatedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Reports fetched successfully",
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

const getReportById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid report id" });
    }

    const report = await Report.findById(req.params.id).populate("generatedBy", "name email");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      message: "Report fetched successfully",
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
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid report id" });
    }

    const validationError = validateReportUpdateInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      buildReportUpdatePayload(req.body),
      { new: true, runValidators: true }
    ).populate("generatedBy", "name email");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteReport = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid report id" });
    }

    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

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

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
};
