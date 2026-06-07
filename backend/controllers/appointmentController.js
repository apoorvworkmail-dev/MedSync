const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

const VALID_STATUSES = ["scheduled", "completed", "cancelled"];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeStatus = (status) => {
  if (typeof status !== "string") {
    return status;
  }

  return status.toLowerCase().trim();
};

const validateAppointmentInput = ({
  patientName,
  doctor,
  appointmentDate,
  appointmentTime,
  reason,
  status,
} = {}) => {
  if (!doctor || !appointmentDate || !appointmentTime) {
    return "Doctor, appointment date, and appointment time are required";
  }

  if (
    (patientName !== undefined && typeof patientName !== "string") ||
    typeof appointmentTime !== "string" ||
    (reason !== undefined && typeof reason !== "string")
  ) {
    return "Patient name, appointment time, and reason must be text values";
  }

  if ((patientName !== undefined && !patientName.trim()) || !appointmentTime.trim()) {
    return "Patient name and appointment time cannot be empty";
  }

  if (!isValidObjectId(doctor)) {
    return "Invalid doctor id";
  }

  const parsedDate = new Date(appointmentDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Appointment date must be a valid date";
  }

  if (status !== undefined && !VALID_STATUSES.includes(normalizeStatus(status))) {
    return "Status must be scheduled, completed, or cancelled";
  }

  return null;
};

const validateAppointmentUpdateInput = (body = {}) => {
  if (Object.keys(body).length === 0) {
    return "At least one field is required";
  }

  const { patientName, doctor, appointmentDate, appointmentTime, reason, status } = body;

  if (patientName !== undefined && (typeof patientName !== "string" || !patientName.trim())) {
    return "Patient name must be a non-empty text value";
  }

  if (doctor !== undefined && !isValidObjectId(doctor)) {
    return "Invalid doctor id";
  }

  if (appointmentDate !== undefined) {
    const parsedDate = new Date(appointmentDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Appointment date must be a valid date";
    }
  }

  if (
    appointmentTime !== undefined &&
    (typeof appointmentTime !== "string" || !appointmentTime.trim())
  ) {
    return "Appointment time must be a non-empty text value";
  }

  if (reason !== undefined && typeof reason !== "string") {
    return "Reason must be a text value";
  }

  if (status !== undefined && !VALID_STATUSES.includes(normalizeStatus(status))) {
    return "Status must be scheduled, completed, or cancelled";
  }

  return null;
};

const buildAppointmentPayload = ({
  patientName,
  doctor,
  appointmentDate,
  appointmentTime,
  reason,
  status,
}, user) => ({
  patient: user.id,
  patientName: typeof patientName === "string" ? patientName.trim() : user.name,
  doctor,
  appointmentDate: new Date(appointmentDate),
  appointmentTime: appointmentTime.trim(),
  reason: typeof reason === "string" ? reason.trim() : "",
  status: normalizeStatus(status) || "scheduled",
});

const buildAppointmentUpdatePayload = (body) => {
  const payload = {};

  if (body.patientName !== undefined) {
    payload.patientName = body.patientName.trim();
  }

  if (body.doctor !== undefined) {
    payload.doctor = body.doctor;
  }

  if (body.appointmentDate !== undefined) {
    payload.appointmentDate = new Date(body.appointmentDate);
  }

  if (body.appointmentTime !== undefined) {
    payload.appointmentTime = body.appointmentTime.trim();
  }

  if (body.reason !== undefined) {
    payload.reason = body.reason.trim();
  }

  if (body.status !== undefined) {
    payload.status = normalizeStatus(body.status);
  }

  return payload;
};

const createAppointment = async (req, res) => {
  try {
    const validationError = validateAppointmentInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const doctor = await Doctor.findById(req.body.doctor);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await Appointment.create(buildAppointmentPayload(req.body, req.user));
    const populatedAppointment = await appointment.populate([
      { path: "patient", select: "name email" },
      { path: "doctor" },
    ]);

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid appointment id" });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email")
      .populate("doctor");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment fetched successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid appointment id" });
    }

    const validationError = validateAppointmentUpdateInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (req.body.doctor !== undefined) {
      const doctor = await Doctor.findById(req.body.doctor);

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      buildAppointmentUpdatePayload(req.body),
      { new: true, runValidators: true }
    )
      .populate("patient", "name email")
      .populate("doctor");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid appointment id" });
    }

    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.status(200).json({
      message: "Appointments fetched successfully",
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

module.exports = {
  createAppointment,
  bookAppointment: createAppointment,
  getAppointments,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
