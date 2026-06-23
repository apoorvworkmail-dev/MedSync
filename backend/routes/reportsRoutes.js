const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/reportUpload");
const router = express.Router();

const {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  uploadReport,
  getMyReports,
  downloadReport,
} = require("../controllers/reportController");

router.get("/", protect, getReports);
router.post("/", protect, createReport);
router.put("/:id", protect, updateReport);
router.delete("/:id", protect, deleteReport);

router.post(
  "/upload",
  protect,
  upload.single("report"),
  uploadReport
);

router.get(
  "/my-reports",
  protect,
  getMyReports
);

router.get(
  "/download/:id",
  protect,
  downloadReport
);

module.exports = router;