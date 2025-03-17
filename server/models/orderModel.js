import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  resId: { type: String, required: true }, // Restaurant ID to track which restaurant receives the order
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: false },
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
