
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Readable } = require("node:stream");
require("dotenv").config();
const path = require("node:path");

const Complaint = require("./models/Complaint");
const authRoutes = require("./routes/authRoutes");
const cloudinary = require("./config/cloudinary");
const upload = require("./config/upload");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to UrbanFix AI Backend"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "UrbanFix AI server is running"
  });
});

const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "urbanfix-complaints",
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

app.post("/api/complaints", (req, res, next) => {
  upload.single("image")(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    try {
      let imageUrl = "";

      if (req.file) {
        const result = await uploadImage(req.file.buffer);
        imageUrl = result.secure_url;
      }

      const complaint = await Complaint.create({
        ...req.body,
        imageUrl
      });

      res.status(201).json({
        message: "Complaint submitted successfully",
        complaint
      });
    } catch (error) {
      res.status(400).json({
        message: "Failed to submit complaint",
        error: error.message
      });
    }
  });
});

app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({
      createdAt: -1
    });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch complaints",
      error: error.message
    });
  }
});
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(
      path.join(__dirname, "../client/dist/index.html")
    );
  }

  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`UrbanFix AI server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
