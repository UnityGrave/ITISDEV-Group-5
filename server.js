const express = require("express");
const connectDB = require("./config/db"); // Load DB connection
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/User"); // Ensure User model is imported
const bcrypt = require("bcryptjs"); //v5


// Load environment variables
dotenv.config();

// Connect to MongoDB (Ensures it's called once)
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Serve homepage.html as the default page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "homepage.html"));
});

// Signup API (Ensure it’s only defined once)
app.post("/api/auth/signup", async (req, res) => {
    console.log("🔹 Signup request received:", req.body);

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword, // Store hashed password
            phoneNumber: req.body.phoneNumber,
            role: req.body.role,
        });

        await newUser.save();
        console.log("✅ User saved successfully:", newUser);

        res.status(201).json({ msg: "User registered successfully!" });
    } catch (error) {
        console.error("❌ Error saving user:", error);
        res.status(500).json({ msg: "Server error. Could not save user." });
    }
});

// Prevent "favicon.ico" errors
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
