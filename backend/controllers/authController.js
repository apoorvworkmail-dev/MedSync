const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


// ==========================
// CREATE JWT TOKEN
// ==========================

const createToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// ==========================
// COMMON AUTH RESPONSE
// ==========================

const sendAuthResponse = (res, statusCode, message, user) => {

  const token = createToken(user._id);

  res.status(statusCode).json({
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

};


// ==========================
// SIGNUP USER
// ==========================

const signupUser = async (req, res) => {

  try {

    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Name, email, and password must be text values",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();

    if (!trimmedName || !normalizedEmail) {
      return res.status(400).json({
        message: "Name and email cannot be empty",
      });
    }

    // Password Length Check
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check Existing User
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    // Send Response
    sendAuthResponse(
      res,
      201,
      "User created successfully",
      user
    );

  } catch (error) {

    // Duplicate Email Error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // Server Error
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

};


// ==========================
// LOGIN USER
// ==========================

const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        message: "Email and password must be text values",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find User
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    // User Not Found
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Invalid Password
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Send Response
    sendAuthResponse(
      res,
      200,
      "Login successful",
      user
    );

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

};

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==========================
// EXPORTS
// ==========================

module.exports = {
  signupUser,
  loginUser,
  getProfile,
};
