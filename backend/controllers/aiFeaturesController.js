const askGemini = require("../services/geminiServices");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Report = require("../models/Reports");

// --------------------
// Helpers
// --------------------
const normalizeText = (v) => (typeof v === "string" ? v.trim() : "");

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "breathing difficulty",
  "shortness of breath",
  "trouble breathing",
  "severe chest",
  "faint",
  "loss of consciousness",
  "stroke",
  "face drooping",
  "slurred speech",
  "uncontrolled bleeding",
  "seizure",
  "blue lips",
  "suicidal",
  "thoughts of suicide",
  "overdose",
];

const checkEmergencyRules = (text) => {
  const t = (text || "").toLowerCase();
  const hits = EMERGENCY_KEYWORDS.filter((k) => t.includes(k));

  if (hits.length > 0) {
    return {
      isEmergency: true,
      matchedKeywords: hits,
      warning:
        "Emergency Warning\nThese symptoms may require immediate medical attention.\nPlease contact emergency services or seek urgent care now.",
    };
  }

  return { isEmergency: false, matchedKeywords: [], warning: "" };
};

const parseSpecializationFromText = (aiText) => {
  // Very light extraction: find first known specialization-like phrase
  const t = (aiText || "").toLowerCase();
  if (!t) return null;

  const mapping = [
    "cardiologist",
    "dermatologist",
    "neurologist",
    "pediatrician",
    "orthopedist",
    "orthopedic",
    "gynecologist",
    "obstetrician",
    "general physician",
    "gastroenterologist",
    "pulmonologist",
    "psychiatrist",
    "urologist",
    "ophthalmologist",
  ];

  const found = mapping.find((s) => t.includes(s));
  if (!found) return null;
  return found
    .replace(/^\r?\n+/, "")
    .replace(/\b([a-z])/g, (m) => m.toUpperCase());
};

// --------------------
// Controllers
// --------------------

// 1) AI Health Assistant Chatbot
const chatWithAI = async (req, res) => {
  try {
    const message = normalizeText(req.body?.message);

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const prompt = `You are MedSync AI Health Assistant.\n\nRules:\n1) Never diagnose.\n2) Provide general health guidance only.\n3) If symptoms may be urgent, advise seeking professional care.\n4) Keep concise.\n\nUser: ${message}`;

    const response = await askGemini(prompt);

    return res.status(200).json({ success: true, response });
  } catch (error) {
    return res.status(500).json({ success: false, message: "AI request failed", error: error.message });
  }
};

// 4) Emergency Symptom Detection
const emergencyCheck = async (req, res) => {
  try {
    const text = normalizeText(req.body?.message || req.body?.text);
    if (!text) {
      return res.status(400).json({ message: "Text/message is required" });
    }

    const rules = checkEmergencyRules(text);
    if (rules.isEmergency) {
      return res.status(200).json({ success: true, ...rules });
    }

    // Not emergency by rules -> optional AI guidance (non-diagnostic)
    const prompt = `You are a healthcare safety assistant.\n\nGiven the user text below, determine if it could be urgent.\nIf not urgent, suggest basic self-care and advise when to see a clinician.\nNever diagnose.\n\nUser text: ${text}`;

    const ai = await askGemini(prompt);

    return res.status(200).json({
      success: true,
      isEmergency: false,
      matchedKeywords: rules.matchedKeywords,
      warning: "",
      aiGuidance: ai,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Emergency check failed", error: error.message });
  }
};

// 2) Smart Specialist Recommendation System
const specialistRecommendation = async (req, res) => {
  try {
    const text = normalizeText(req.body?.message || req.body?.text);
    if (!text) {
      return res.status(400).json({ message: "Text/message is required" });
    }

    const prompt = `You are a medical triage assistant that recommends the most appropriate medical specialist (one).\n\nNever diagnose.\nReturn ONLY the specialist name (single line).\nPossible examples: Dermatologist, Cardiologist, Neurologist, Pediatrician, Orthopedic Surgeon, Gynecologist, Gastroenterologist, Pulmonologist, Psychiatrist, Urologist, Ophthalmologist, General Physician.\n\nUser symptoms: ${text}`;

    const aiText = await askGemini(prompt);

    // Try to find specialization in AI response
    const specialization = (aiText || "").split(/\n|\r/)[0].trim();

    const doctors = await Doctor.find({
      specialization: { $regex: specialization, $options: "i" },
    }).limit(8);

    return res.status(200).json({
      success: true,
      specialization,
      doctors,
      aiRaw: aiText,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Specialist recommendation failed", error: error.message });
  }
};

// 3) AI Medical Report Summarizer (text-based for now)
const reportSummarizer = async (req, res) => {
  try {
    const text = normalizeText(req.body?.message || req.body?.reportText || req.body?.text);

    if (!text) {
      return res.status(400).json({ message: "Report text is required" });
    }

    const prompt = `You are a medical report summarizer.\n\nTask:\n- Extract key findings\n- Translate medical terms into simple language\n- Provide general next-steps\n\nRules:\n- Never diagnose\n- Advise discussing results with a clinician\n- Output in sections with bullet points\n\nReport text:\n${text}`;

    const summary = await askGemini(prompt);

    return res.status(200).json({ success: true, summary });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Report summarization failed", error: error.message });
  }
};

// 5) Conversational Appointment Booking
const conversationBookAppointment = async (req, res) => {
  try {
    const message = normalizeText(req.body?.message || req.body?.text);
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const prompt = `You are an assistant that books appointments.\n\nExtract: \n1) doctor specialization (single words like Dermatologist, Cardiologist, etc.)\n2) preferred date (ISO yyyy-mm-dd) if mentioned; otherwise empty string\n3) preferred time (string like 10:30 AM) if mentioned; otherwise empty string\n\nReturn ONLY valid JSON with keys: specialization, date, time.\nIf you cannot find something, use an empty string.\n\nUser message: ${message}`;

    const ai = await askGemini(prompt);

    let data;
    try {
      data = JSON.parse(ai);
    } catch {
      // fallback: minimal parse
      data = { specialization: ai.split(/\n/)[0]?.trim() || "", date: "", time: "" };
    }

    if (!data.specialization) {
      return res.status(200).json({
        success: true,
        confirmRequired: true,
        message: "I couldn't identify the specialist. Please specify doctor type (e.g., cardiologist, dermatologist).",
        extracted: data,
      });
    }

    const doctors = await Doctor.find({
      specialization: { $regex: data.specialization, $options: "i" },
    }).limit(5);

    if (doctors.length === 0) {
      return res.status(200).json({
        success: true,
        confirmRequired: false,
        message: "No doctors found for that specialization. Try another specialty.",
        extracted: data,
        doctors: [],
      });
    }

    // For simplicity: if no date/time, ask for confirm.
    if (!data.date || !data.time) {
      return res.status(200).json({
        success: true,
        confirmRequired: true,
        message: "I found matching doctors. Please provide a date and time to book.",
        extracted: data,
        doctors,
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      patientName: req.user.name,
      doctor: doctors[0]._id,
      appointmentDate: new Date(data.date),
      appointmentTime: data.time,
      reason: `Booked via AI: ${data.specialization}`,
      status: "scheduled",
    });

    const populated = await appointment.populate("doctor");

    return res.status(201).json({
      success: true,
      confirmRequired: false,
      message: "Appointment booked successfully",
      appointment: populated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Appointment booking failed", error: error.message });
  }
};

// 6) Personalized Health Insights
const personalizedHealthInsights = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).populate("doctor");
    const reports = await Report.find({ generatedBy: req.user.id });

    const prompt = `You are a healthcare coach.\n\nBased on the following user history, generate personalized insights and suggested next steps.\n\nRules:\n- Never diagnose\n- Be supportive and practical\n- Output bullet points\n\nAppointments:\n${appointments
      .map((a) => `- ${a.appointmentDate?.toISOString().slice(0, 10)} at ${a.appointmentTime} with ${a.doctor?.name || "Doctor"} (${a.status})`)
      .join("\n")}\n\nReports:\n${reports.map((r) => `- ${r.title} (${r.status || ""})`).join("\n")}`;

    const insights = await askGemini(prompt);

    return res.status(200).json({ success: true, insights, appointmentsCount: appointments.length, reportsCount: reports.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Personalized insights failed", error: error.message });
  }
};

// 7) Medication Information Assistant
const medicationInformation = async (req, res) => {
  try {
    const message = normalizeText(req.body?.message || req.body?.medication || req.body?.name);
    if (!message) return res.status(400).json({ message: "Medication question is required" });

    const prompt = `You are a medication information assistant.\n\nProvide general information about the medication/medicine name the user asked for:\n- common uses\n- common precautions / warnings\n- general advice (non-diagnostic)\n\nRules:\n- Do NOT give dosing\n- Encourage consulting a clinician or pharmacist\n- Provide a brief disclaimer\n\nUser question: ${message}`;

    const info = await askGemini(prompt);
    return res.status(200).json({ success: true, info });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Medication info failed", error: error.message });
  }
};

// 8) Medical Terminology Simplifier
const terminologySimplifier = async (req, res) => {
  try {
    const message = normalizeText(req.body?.message || req.body?.term);
    if (!message) return res.status(400).json({ message: "Term/text is required" });

    const prompt = `Simplify medical terminology into plain language.\n\nReturn:\n- Plain-language meaning\n- Why it might matter\n- Suggest discussing with a clinician\n\nRules:\n- Never diagnose\n- Be understandable\n\nText to simplify:\n${message}`;

    const simplified = await askGemini(prompt);
    return res.status(200).json({ success: true, simplified });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Terminology simplification failed", error: error.message });
  }
};

// 9) Preventive Healthcare & Wellness Advisor
const preventiveWellnessAdvisor = async (req, res) => {
  try {
    const message = normalizeText(req.body?.message || req.body?.concern || req.body?.text);
    if (!message) return res.status(400).json({ message: "Concern/question is required" });

    const prompt = `You are a preventive healthcare and wellness advisor.\n\nUser concern: ${message}\n\nProvide personalized wellness tips, lifestyle habits, and preventive care suggestions.\n\nRules:\n- Never diagnose\n- Keep it safe and general\n- Include when to seek medical care\n- Bullet points only`;

    const advice = await askGemini(prompt);
    return res.status(200).json({ success: true, advice });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Wellness advice failed", error: error.message });
  }
};

module.exports = {
  chatWithAI,
  emergencyCheck,
  specialistRecommendation,
  reportSummarizer,
  conversationBookAppointment,
  personalizedHealthInsights,
  medicationInformation,
  terminologySimplifier,
  preventiveWellnessAdvisor,
};

