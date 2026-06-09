const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getAllUsers } = require("../controllers/userController");

const router = express.Router();

// Example admin-like route (still protected by JWT)
router.get("/", protect, getAllUsers);

module.exports = router;
