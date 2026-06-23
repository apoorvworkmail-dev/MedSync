const Doctor = require("../models/Doctor");


// Add Doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      experience,
      fees,
      phone,
      email,
      availability,
    } = req.body;

    if (
      !name ||
      !specialization ||
      !experience ||
      !fees ||
      !phone ||
      !email
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      experience,
      fees,
      phone,
      email,
      availability,
    });

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


// Get All Doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.status(200).json({
      count: doctors.length,
      doctors,
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

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
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

    const doctor = await Doctor.findByIdAndDelete(
      req.params.id
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
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
  updateDoctor,
  deleteDoctor,
};