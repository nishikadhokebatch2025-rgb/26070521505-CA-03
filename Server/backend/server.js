const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const Contact = mongoose.model(
  "Contact",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      subject: { type: String, required: true },
      message: { type: String, required: true },
    },
    { timestamps: true }
  )
);

app.get("/", (req, res) => {
  res.send("Nishika Dhoke Portfolio Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is working" });
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields"
      });
    }

    const savedMessage = await Contact.create({
      name,
      email,
      subject,
      message
    });

    return res.status(201).json({
      success: true,
      message: "Message saved successfully",
      data: savedMessage
    });
  } catch (error) {
    console.error("Contact API error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not save message"
    });
  }
});
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
}

startServer();