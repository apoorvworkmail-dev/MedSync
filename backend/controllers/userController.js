const User = require("../models/User");

// Minimal user endpoints to prevent runtime crashes.
// Current app primarily uses auth/profile via authRoutes.

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllUsers,
};

