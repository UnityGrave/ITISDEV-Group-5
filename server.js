const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");

// Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const User = require("./models/User");
const Order = require("./models/Order"); // make sure you have this

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// ✅ Mount routes
app.use("/api/users", userRoutes); // for user operations
app.use("/api/auth", authRoutes); // for signup & login
app.use("/api/orders", orderRoutes); // for order submissions

// Serve frontend pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "homepage.html"));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/admin_dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin_dashboard.html'));
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

// ✅ File upload config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ✅ Order submission route (with file upload)
app.post("/api/orders/submit", upload.single("file_upload"), async (req, res) => {
    try {
        const { product, quantity, name, contact, email, due_date, notes } = req.body;

        if (!product || !quantity || !name || !contact || !email || !due_date) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let fileData = {};
        if (req.file) {
            fileData = {
                uploadedFilePath: `/uploads/${req.file.filename}`,
                fileOriginalName: req.file.originalname,
                fileMimeType: req.file.mimetype,
            };
        }

        const orderData = {
            product,
            quantity,
            name,
            contact,
            email,
            due_date,
            notes,
            ...fileData,
        };

        const orderFileName = `order_${Date.now()}.json`;
        const orderFilePath = `./orders/${orderFileName}`;
        fs.writeFileSync(orderFilePath, JSON.stringify(orderData, null, 2));

        orderData.filePath = orderFilePath;

        const newOrder = new Order(orderData);
        await newOrder.save();

        res.status(201).json({ msg: "Order submitted with file!", order: newOrder });
    } catch (error) {
        console.error("❌ Error submitting order:", error);
        res.status(500).json({ msg: "Server error. Order not stored." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
