import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { sendOrderConfirmationEmail } from "../services/emailService.js";

export const createOrder = async (req, res) => {
  try {
    const { products, totalPrice, address, paymentMethod, razorpayOrderId } = req.body;
    const order = await Order.create({
      userId: req.user._id,
      products,
      totalPrice,
      address,
      paymentMethod,
      ...(razorpayOrderId && { razorpayOrderId })
    });

    // Get user details for email
    const user = await User.findById(req.user._id);
    
    // Send order confirmation email (non-blocking)
    if (user && user.email) {
      // Execute in background
      (async () => {
        try {
          const populatedOrder = await Order.findById(order._id).populate('products.product');
          if (populatedOrder) {
            await sendOrderConfirmationEmail(user.email, populatedOrder, user);
          }
        } catch (emailError) {
          console.error('Failed to send order email in background:', emailError);
        }
      })();
    }

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1
    });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

