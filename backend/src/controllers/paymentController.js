import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Cart } from "../models/Cart.js";
import {
  STRIPE_SECRET_KEY,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET
} from "../config/env.js";
import { sendPaymentConfirmationEmail, testEmailConnection, sendWelcomeEmail } from "../services/emailService.js";

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

const razorpay = RAZORPAY_KEY_ID
  ? new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    })
  : null;

const reduceStockAndClearCart = async (order) => {
  try {
    // Reduce stock for each product
    for (const item of order.products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear the user's cart
    await Cart.findOneAndUpdate(
      { user: order.userId },
      { $set: { items: [] } }
    );

    console.log(`Stock reduced and cart cleared for order ${order._id}`);
  } catch (error) {
    console.error('Error reducing stock and clearing cart:', error);
  }
};

export const testEmail = async (req, res) => {
  try {
    const success = await testEmailConnection();
    if (success) {
      return res.json({ message: "Test email sent successfully!" });
    } else {
      return res.status(500).json({ message: "Failed to send test email" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Email test failed", error: err.message });
  }
};

export const testWelcomeEmail = async (req, res) => {
  try {
    const testUser = {
      name: "Test User",
      email: "test2@example.com",
      role: "user"
    };
    
    await sendWelcomeEmail(testUser.email, testUser);
    return res.json({ message: "Welcome email test sent successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Welcome email test failed", error: err.message });
  }
};

export const createStripePaymentIntent = async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ message: "Stripe not configured" });
  }
  try {
    const { amount, currency = "inr", orderId } = req.body;
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId }
    });
    return res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create payment intent", error: err.message });
  }
};

export const createRazorpayOrder = async (req, res) => {
  if (!razorpay) {
    return res.status(500).json({ message: "Razorpay not configured" });
  }
  try {
    const { amount, currency = "INR", orderId } = req.body;
    const rpOrder = await razorpay.orders.create({
      amount,
      currency,
      receipt: orderId
    });
    return res.json(rpOrder);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create Razorpay order", error: err.message });
  }
};

export const markOrderPaid = async (req, res) => {
  try {
    const { provider } = req.body;
    const existing = await Order.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Idempotency: don't reduce stock / email twice
    if (existing.paymentStatus === "paid") {
      const populated = await Order.findById(existing._id).populate("products.product");
      return res.json(populated);
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "paid", paymentProvider: provider || "none" },
      { new: true }
    ).populate("products.product");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Reduce stock and clear cart after successful payment
    await reduceStockAndClearCart(order);

    // Send payment confirmation email
    const user = await User.findById(order.userId);
    if (user && user.email) {
      await sendPaymentConfirmationEmail(user.email, order, user);
    }

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: "Failed to mark order paid", error: err.message });
  }
};

export const handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = RAZORPAY_KEY_SECRET;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const expectedSignature = crypto.createHmac('sha256', webhookSecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (razorpay_signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Find and update the order
    const order = await Order.findOne({ 'razorpayOrderId': razorpay_order_id }).populate('products.product');
    if (order) {
      order.paymentStatus = 'paid';
      order.paymentProvider = 'razorpay';
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();

      // Reduce stock and clear cart after successful payment
      await reduceStockAndClearCart(order);

      // Send payment confirmation email
      const user = await User.findById(order.userId);
      if (user && user.email) {
        await sendPaymentConfirmationEmail(user.email, order, user);
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    return res.status(500).json({ message: "Webhook failed", error: err.message });
  }
};

