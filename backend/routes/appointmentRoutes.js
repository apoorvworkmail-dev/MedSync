const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");


console.log("protect =", protect);
console.log("bookAppointment =", bookAppointment);
console.log("getMyAppointments =", getMyAppointments);
console.log("cancelAppointment =", cancelAppointment);

// Book Appointment
router.post("/", protect, bookAppointment);

// Get My Appointments
router.get("/my", protect, getMyAppointments);

// Cancel Appointment
router.delete("/:id", protect, cancelAppointment);

// Update Appointment Status
router.put("/:id/status", protect, updateAppointmentStatus);

module.exports = router;