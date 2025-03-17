import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Fixed typo in STRIPE_SECRET_KEY

// Placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  console.log("place order request", req.body)
  try {
    const { orderType, pickupTime, items, amount, userId } = req.body;
    const restaurant_id = items[0].restaurant_id; // Extract restaurant ID
  
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      orderType, // New field
      pickupTime, // New field
      resId: restaurant_id, // New field
    });
  
    await newOrder.save();
    console.log("✅ Order successfully inserted:", newOrder); // Success log
  
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
  
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
  
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 99 * 100,
      },
      quantity: 1,
    });
  
    res.status(201).json({ success:true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Error in placeOrder:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
  
  


  // try {
  //   const { userId, items, amount, address } = req.body;

  //   const newOrder = new orderModel({
  //     userId,
  //     items,
  //     amount,
  //     address,
  //   });

  //     await newOrder.save();
  //     await userModel.findByIdAndUpdate(userId, { cartData: {} });

  //     const line_items = items.map((item) => ({
  //       price_data: {
  //         currency: "inr",
  //         product_data: { name: item.name },
  //         unit_amount: item.price * 100,
  //       },
  //       quantity: item.quantity,
  //     }));

  //     line_items.push({
  //       price_data: {
  //         currency: "inr",
  //         product_data: { name: "Delivery Charges" },
  //         unit_amount: 99 * 100,
  //       },
  //       quantity: 1,
  //     });

  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ["card"],
  //       line_items,
  //       mode: "payment",
  //       success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
  //       cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
  //     });

  //     res.json({ success: true, session_url: session.url });
  //   } catch (error) {
  //     console.error("Error in placeOrder:", error);
  //     res.status(500).json({ success: false, message: "Failed to place order" });
  //   }
};

// Verifying order payment status
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === true) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed, order canceled" });
    }
  } catch (error) {
    console.error("Error in verifyOrder:", error);
    res.status(500).json({ success: false, message: "Failed to verify order" });
  }
};

// Fetch user orders for frontend (Protected)
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user._id });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error in userOrders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user orders" });
  }
};

// List all orders for admin panel (Protected)
const listOrders = async (req, res) => {
  try {
    if (!true) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error in listOrders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// Update order status (Protected)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status required" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error in updateStatus:", error);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
