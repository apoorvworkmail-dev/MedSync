const express = require("express");
const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, getReports)
  .post(protect, createReport);

router
  .route("/:id")
  .get(protect, getReportById)
  .put(protect, updateReport)
  .delete(protect, deleteReport);

module.exports = router;
