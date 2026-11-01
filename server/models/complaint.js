
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["Pothole", "Road Damage", "Waterlogging", "Other"]
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      default: ""
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "In Progress", "Resolved"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
