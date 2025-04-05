// GET /api/users/with-orders
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");

router.get("/with-orders", async (req, res) => {
  try {
    // Fetch all customers
    const customers = await User.find({ role: "customer" });

    // Fetch all orders
    const allOrders = await Order.find({}, "_id orderId email"); // only get the fields we need

    // Group orders by email
    const ordersByEmail = {};
    allOrders.forEach(order => {
      const email = order.email;
      if (!ordersByEmail[email]) {
        ordersByEmail[email] = [];
      }
      ordersByEmail[email].push({
        _id: order._id,
        orderId: order.orderId
      });
    });

    // Combine customers with their orders
    const result = customers.map(customer => ({
      fullName: customer.fullName,
      phoneNumber: customer.phoneNumber,
      email: customer.email,
      orders: ordersByEmail[customer.email] || []
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching users with orders:", err);
    res.status(500).json({ msg: "Server error" });
  }
});



module.exports = router;
