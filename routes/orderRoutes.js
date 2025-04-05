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

router.post("/submit", upload.single("file_upload"), async (req, res) => {
    try {
        const { product, quantity, name, contact, email, due_date, notes } = req.body;

        if (!product || !quantity || !name || !contact || !email || !due_date) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let fileData = {};
        if (req.file) {
            const fileBuffer = fs.readFileSync(req.file.path);
            const fileBase64 = fileBuffer.toString("base64");

            fileData = {
                fileBase64,
                uploadedFilePath: `/uploads/${req.file.filename}`,
                fileOriginalName: req.file.originalname,
                fileMimeType: req.file.mimetype,
            };
        }

        // Price computation logic (adjust as needed)
        const basePrices = {
            "Regular Printing": 5,
            "One-sided Laminated ID/Nametag (3R)": 15,
            "Back-to-back Laminated ID/Nametag (3R)": 25,
            "1/4 size Lamination": 10,
            "1/2 size Lamination": 20,
            "1 whole size Lamination": 35,
            "Certificate Printing (Letter)": 20,
            "Matte Sticker Paper Printing (A4)": 50,
            "Glossy Sticker Paper Printing (A4)": 55,
            "Matte Board Printing (A4)": 75,
            "Perforated Ticket Printing": 30,
            "Poster Printing (A4)": 40
        };
        
        const unitPrice = basePrices[product] || 0;
        const totalPrice = unitPrice * parseInt(quantity);

        // Get latest orderId
        const latestOrder = await Order.findOne().sort({ dateOrdered: -1 });
        let nextIdNumber = 1;
        if (latestOrder?.orderId) {
            const lastNum = parseInt(latestOrder.orderId.replace("#", ""));
            if (!isNaN(lastNum)) {
                nextIdNumber = lastNum + 1;
            }
        }
        const orderId = `#${String(nextIdNumber).padStart(3, "0")}`;

        const orderData = {
            product,
            quantity,
            name,
            contact,
            email,
            due_date,
            notes,
            totalPrice,
            orderId,
            status: "processing",
            ...fileData,
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        // Save to local file (optional existing behavior)
        const orderFilePath = `./orders/order_${Date.now()}.json`;
        fs.writeFileSync(orderFilePath, JSON.stringify(orderData, null, 2));
        newOrder.filePath = orderFilePath;
        await newOrder.save();

        res.status(201).json({ msg: "Order submitted successfully!", order: newOrder });
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
  
// PUT /api/orders/:id - update an order
router.put("/:id", async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedOrder) {
        return res.status(404).json({ msg: "Order not found" });
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ msg: "Server error" });
    }
  });

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: "Order not found" });
        }
        res.json(order);
    } catch (err) {
        console.error("Error fetching order:", err);
        res.status(500).json({ msg: "Server error fetching order" });
    }
});


module.exports = router;
