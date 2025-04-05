const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  due_date: { type: Date, required: true },
  notes: { type: String },
  fileBase64: { type: String },

  // Existing file fields
  filePath: { type: String },
  uploadedFilePath: { type: String },
  fileOriginalName: { type: String },
  fileMimeType: { type: String },
  uploadedAt: { type: Date, default: Date.now },

  // ➕ New fields
  orderId: { type: String, unique: true }, // like #001, #002
  totalPrice: { type: Number, required: true },
  dateOrdered: { type: Date, default: Date.now },
  status: { type: String, enum: ["processing", "completed", "cancelled"], default: "processing" },
});

module.exports = mongoose.model("Order", OrderSchema);
