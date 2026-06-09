const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  emergencyCheck,
  specialistRecommendation,
  reportSummarizer,
  conversationBookAppointment,
  personalizedHealthInsights,
  medicationInformation,
  terminologySimplifier,
  preventiveWellnessAdvisor,
  // also re-exported chatbot for convenience
  chatWithAI,
} = require("../controllers/aiFeaturesController");

const router = express.Router();

// Hard health endpoint for clients; define only GET handlers.
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Public (no auth) endpoints (all POST)
router.post("/chat", chatWithAI);
router.post("/emergency-check", emergencyCheck);
router.post("/specialist", specialistRecommendation);

// Protected endpoints (use user context for personalized features)
router.post("/report-summary", protect, reportSummarizer);
router.post("/book-appointment", protect, conversationBookAppointment);
router.post("/personalized-insights", protect, personalizedHealthInsights);
router.post("/medication-info", protect, medicationInformation);
router.post("/term-simplify", protect, terminologySimplifier);
router.post("/wellness-advisor", protect, preventiveWellnessAdvisor);

module.exports = router;

