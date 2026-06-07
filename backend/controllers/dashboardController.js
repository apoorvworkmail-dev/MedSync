const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const startOfTomorrow = () => {
  const date = startOfToday();
  date.setDate(date.getDate() + 1);
  return date;
};

const getDashboardSummary = async (req, res) => {
  try {
    const [totalPatients, totalDoctors, totalAppointments, todayAppointments] =
      await Promise.all([
        Patient.countDocuments(),
        Doctor.countDocuments(),
        Appointment.countDocuments(),
        Appointment.countDocuments({
          appointmentDate: {
            $gte: startOfToday(),
            $lt: startOfTomorrow(),
          },
        }),
      ]);

    res.status(200).json({
      message: "Dashboard summary fetched successfully",
      summary: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
};
