// api.js (in root directory)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import Candidate from "./models/candidate.js";

dotenv.config();
const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Registration route
app.post("/api/register", async (req, res) => {
  try {
    const { name, position, email } = req.body;
    
    if (!name || !position || !email) {
      return res.status(400).json({ 
        success: false,
        msg: "All fields are required" 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        msg: "Please provide a valid email address"
      });
    }

    const alreadyRegistered = await Candidate.findOne({ email });
    if (alreadyRegistered) {
      return res.status(400).json({ 
        success: false,
        msg: `${name} has already registered for a position` 
      });
    }

    const newCandidate = new Candidate({ name, position, email });
    await newCandidate.save();

    console.log('✅ New candidate registered:', {
      name: newCandidate.name,
      email: newCustomer.email,
      position: newCandidate.position,
      time: new Date().toLocaleString()
    });

    res.json({ 
      success: true,
      msg: "Registration successful!",
      candidate: newCandidate 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      msg: "Server error. Please try again later." 
    });
  }
});

// Committee dashboard API
app.get("/api/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "committe.html"));
});

export default app;