console.log("Doctor Routes Loaded");
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  addDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");


// Add Doctor
router.post("/", protect, addDoctor);

// Get All Doctors
router.get("/", protect, getDoctors);

router.put("/:id", protect, updateDoctor);

router.delete("/:id", protect, deleteDoctor);

module.exports = router;