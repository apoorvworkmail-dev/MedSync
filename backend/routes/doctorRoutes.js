const express = require("express");
const {
  addDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .get(protect, getDoctors)
  .post(protect, addDoctor);

router.route("/:id")
  .get(protect, getDoctorById)
  .put(protect, updateDoctor)
  .delete(protect, deleteDoctor);

module.exports = router;
