const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");


// Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, appointmentTime } = req.body;

    if (!doctor || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        message: "Doctor, appointment date, and appointment time are required",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      appointmentDate,
      appointmentTime,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// Get My Appointments
const getMyAppointments = async (req, res) => {
  try {
    let query = { patient: req.user.id };

    if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ name: req.user.name });
      if (doctorProfile) {
        query = { doctor: doctorProfile._id };
      } else {
        query = {}; // fallback if profile not linked yet
      }
    } else if (req.user.role === "admin") {
      query = {};
    }

    const appointments = await Appointment.find(query)
      .populate("doctor", "name specialization fees")
      .populate("patient", "name");

    res.status(200).json({
      count: appointments.length,
      appointments,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


// Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    let isAuthorized = false;
    if (appointment.patient.toString() === req.user.id.toString()) {
      isAuthorized = true;
    } else if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ name: req.user.name });
      if (doctorProfile && appointment.doctor.toString() === doctorProfile._id.toString()) {
        isAuthorized = true;
      }
    } else if (req.user.role === "admin") {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({
        message: "Not authorized to cancel this appointment",
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const appointment =
      await Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      message: "Status updated",
      appointment,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  updateAppointmentStatus,
};

// (exports consolidated above)