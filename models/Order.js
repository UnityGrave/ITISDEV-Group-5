const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  due_date: { type: Date, required: true },
  notes: { type: String },

  // Store order JSON file (existing functionality)
  filePath: { type: String }, 

  // New: Store uploaded file details
  uploadedFilePath: { type: String }, // Path in /uploads/
  fileOriginalName: { type: String }, // Original name of uploaded file
  fileMimeType: { type: String }, // File type (e.g., image/jpeg, application/pdf)
  uploadedAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("Order", OrderSchema);
