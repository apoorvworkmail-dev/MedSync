const Patient = require("../models/Patient");

const parseNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return NaN;
  }

  return Number(value);
};

const validatePatientInput = ({ name, age, gender, phone, address } = {}) => {
  if (!name || age === undefined || !gender || !phone || !address) {
    return "Name, age, gender, phone, and address are required";
  }

  if (
    typeof name !== "string" ||
    typeof gender !== "string" ||
    typeof phone !== "string" ||
    typeof address !== "string"
  ) {
    return "Name, gender, phone, and address must be text values";
  }

  if (!name.trim() || !gender.trim() || !phone.trim() || !address.trim()) {
    return "Patient text fields cannot be empty";
  }

  const numericAge = parseNumber(age);

  if (!Number.isFinite(numericAge) || numericAge < 0) {
    return "Age must be a valid non-negative number";
  }

  return null;
};

const buildPatientPayload = ({ name, age, gender, phone, address }) => ({
  name: name.trim(),
  age: Number(age),
  gender: gender.trim(),
  phone: phone.trim(),
  address: address.trim(),
});

const addPatient = async (req, res) => {
  try {
    const validationError = validatePatientInput(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const patient = await Patient.create(buildPatientPayload(req.body));

    res.status(201).json({
      message: "Patient added successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Patients fetched successfully",
      count: patients.length,
      patients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  addPatient,
  getPatients,
};
