
const express = require("express");



console.log("AUTH ROUTES LOADED");

const router = express.Router();

const { 
  signupUser,
  loginUser,
  getProfile 
} = require("../controllers/authController");


const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signupUser);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route works"
  });
});

module.exports = router;
