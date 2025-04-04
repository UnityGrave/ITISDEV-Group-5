const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Order = require("../models/Order");

// Setup multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/orders/submit
router.post("/submit", upload.single("file_upload"), async (req, res) => {
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

// GET /api/orders - fetch all orders from MongoDB
router.get("/", async (req, res) => {
    try {
      const orders = await Order.find({});
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  

module.exports = router;
