const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
console.log("AUTH ROUTES OBJECT:", authRoutes);
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const patientRoutes = require("./routes/patientRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const userRoutes = require("./routes/userRoutes");
const aiFeaturesRoutes = require("./routes/aiFeaturesRoutes");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing in environment variables");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing in environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

console.log("About to mount auth routes");

app.use("/api/auth", authRoutes);

console.log("Auth routes mounted");
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/users", userRoutes);

// AI feature routes
app.use("/api/ai", aiFeaturesRoutes);

console.log(
  "Registered /api/ai routes:",
  aiFeaturesRoutes.stack
    .filter((r) => r.route)
    .map((r) => ({
      path: r.route.path,
      methods: Object.keys(r.route.methods || {}),
    }))
);


app.get("/", (req, res) => {
  res.send("MedSync Backend Running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "MedSync Backend",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

