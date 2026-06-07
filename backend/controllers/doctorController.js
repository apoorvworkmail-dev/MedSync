const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");

const parseNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return NaN;
  }

  return Number(value);
};

const validateDoctorInput = ({ name, specialization, experience, fees } = {}) => {
  if (!name || !specialization || experience === undefined || fees === undefined) {
    return "All fields are required";
  }

  if (typeof name !== "string" || typeof specialization !== "string") {
    return "Name and specialization must be text values";
  }

  const trimmedName = name.trim();
  const trimmedSpecialization = specialization.trim();
  const numericExperience = parseNumber(experience);
  const numericFees = parseNumber(fees);

  if (!trimmedName || !trimmedSpecialization) {
    return "Name and specialization cannot be empty";
  }

  if (!Number.isFinite(numericExperience) || numericExperience < 0) {
    return "Experience must be a valid non-negative number";
  }

  if (!Number.isFinite(numericFees) || numericFees < 0) {
    return "Fees must be a valid non-negative number";
  }

  return null;
};

const isValidDoctorId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildDoctorPayload = ({ name, specialization, experience, fees }) => ({
  name: name.trim(),
  specialization: specialization.trim(),
  experience: Number(experience),
  fees: Number(fees),
});

const addDoctor = async (req, res) => {
  try {
    const validationError = validateDoctorInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const doctor = await Doctor.create(buildDoctorPayload(req.body));

    res.status(201).json({
      message: "Doctor added successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    if (!isValidDoctorId(req.params.id)) {
      return res.status(400).json({ message: "Invalid doctor id" });
    }

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor fetched successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateDoctor = async (req, res) => {
  try {
    if (!isValidDoctorId(req.params.id)) {
      return res.status(400).json({ message: "Invalid doctor id" });
    }

    const validationError = validateDoctorInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      buildDoctorPayload(req.body),
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    if (!isValidDoctorId(req.params.id)) {
      return res.status(400).json({ message: "Invalid doctor id" });
    }

    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  addDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
