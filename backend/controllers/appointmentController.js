const Appointment = require("../models/Appointment");


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

    const appointments = await Appointment.find({
      patient: req.user.id,
    })
      .populate("doctor", "name specialization fees");

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
    const appointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      message: "Appointment cancelled successfully",
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
};

// (exports consolidated above)