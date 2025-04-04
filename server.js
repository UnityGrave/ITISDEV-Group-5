const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");

const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "homepage.html"));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/admin_dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin_dashboard.html'));
});

// 👇 Handle auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// 👇 Handle order routes (which include the file upload handling now)
app.use("/api/orders", require("./routes/orderRoutes"));

app.get("/favicon.ico", (req, res) => res.status(204).end());

// Updated storage logic for file uploads
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

// Unified route: handle both order and file upload
app.post("/api/orders/submit", upload.single("file_upload"), async (req, res) => {
    try {
        const { product, quantity, name, contact, email, due_date, notes } = req.body;

        if (!product || !quantity || !name || !contact || !email || !due_date) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // File info (if uploaded)
        let fileData = {};
        if (req.file) {
            fileData = {
                uploadedFilePath: `/uploads/${req.file.filename}`,
                fileOriginalName: req.file.originalname,
                fileMimeType: req.file.mimetype,
            };
        }

        // Full order object
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

        // Save JSON file in "orders/" folder
        const orderFileName = `order_${Date.now()}.json`;
        const orderFilePath = `./orders/${orderFileName}`;
        fs.writeFileSync(orderFilePath, JSON.stringify(orderData, null, 2));

        // Add file path to DB
        orderData.filePath = orderFilePath;

        // Save to MongoDB
        const newOrder = new Order(orderData);
        await newOrder.save();

        res.status(201).json({ msg: "Order submitted with file!", order: newOrder });
    } catch (error) {
        console.error("❌ Error submitting order:", error);
        res.status(500).json({ msg: "Server error. Order not stored." });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
