const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },

    reportType: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Reviewed"],
      default: "Pending",
    },

    reportDate: {
      type: Date,
      default: Date.now,
    },

    title: {
      type: String,
    },

    category: {
      type: String,
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reportName: {
      type: String,
    },

    fileUrl: {
      type: String,
    },

    aiSummary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);