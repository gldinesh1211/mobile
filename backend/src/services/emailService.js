import nodemailer from "nodemailer";
import {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  APP_CONFIG
} from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST || "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER?.trim(),
    pass: EMAIL_PASS?.trim(),
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify SMTP connection on startup
console.log("Attempting to verify SMTP connection...");
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error Details:", error);
  } else {
    console.log("SMTP Server is ready to take messages ✅");
  }
});

export const sendWelcomeEmail = async (userEmail, user) => {
  try {
    const frontendUrl = APP_CONFIG.frontendUrl;
    const mailOptions = {
      from: `"Gadgetra Store" <${EMAIL_USER}>`,
      to: userEmail,
      subject: `Welcome to Gadgetra Store, ${user.name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #28a745; color: white; padding: 20px; text-align: center;">
            <h1>🎉 Welcome to Gadgetra Store!</h1>
            <h2>Your Account is Ready</h2>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h3>Hi ${user.name},</h3>
            <p>Welcome and thank you for joining Gadgetra Store! We're excited to have you as part of our community.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>🎁 What's Next?</h4>
              <ul style="line-height: 1.8;">
                <li><strong>Browse Products:</strong> Explore our wide range of electronics and gadgets</li>
                <li><strong>Special Offers:</strong> Get exclusive deals and member-only discounts</li>
                <li><strong>Easy Checkout:</strong> Enjoy fast and secure payment options</li>
                <li><strong>Order Tracking:</strong> Stay updated on your orders every step of the way</li>
              </ul>
            </div>
            
            <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>🔐 Your Account Details</h4>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Account Type:</strong> ${user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
              <p><strong>Member Since:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>🛒 Ready to Shop?</h4>
              <p>Start exploring our amazing products and find exactly what you're looking for!</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${frontendUrl}/products" 
                   style="background: #3399cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Start Shopping
                </a>
              </div>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>💡 Pro Tips</h4>
              <ul style="line-height: 1.8;">
                <li>Add items to your wishlist for later</li>
                <li>Sign up for our newsletter for exclusive deals</li>
                <li>Check out our customer reviews before buying</li>
                <li>Take advantage of our secure payment options</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} Gadgetra Store. All rights reserved.</p>
            <p>Need help? Contact us at support@gadgetra.com</p>
            <p>Follow us on social media for updates and special offers!</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

export const sendOrderConfirmationEmail = async (userEmail, order, user) => {
  try {
    const mailOptions = {
      from: `"Gadgetra Store" <${EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmation - Order #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #3399cc; color: white; padding: 20px; text-align: center;">
            <h1>🛍️ Gadgetra Store</h1>
            <h2>Order Confirmation</h2>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h3>Thank you for your order, ${user.name}!</h3>
            <p>Your order has been successfully placed and will be processed shortly.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>Order Details</h4>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
              <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
              <p><strong>Delivery Address:</strong> ${order.address}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>Order Items</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #3399cc; color: white;">
                    <th style="padding: 10px; text-align: left;">Product</th>
                    <th style="padding: 10px; text-align: center;">Quantity</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                    <th style="padding: 10px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.products.map(item => `
                    <tr>
                      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.product.name || 'Product'}</td>
                      <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                      <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
                      <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; color: #3399cc;">$${order.totalPrice.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>📦 Delivery Information</h4>
              <p><strong>Estimated Delivery:</strong> 5-7 business days</p>
              <p><strong>Tracking:</strong> You will receive tracking information once your order is shipped.</p>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} Gadgetra Store. All rights reserved.</p>
            <p>Need help? Contact us at support@gadgetra.com</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

export const sendPaymentConfirmationEmail = async (userEmail, order, user) => {
  try {
    const mailOptions = {
      from: `"Gadgetra Store" <${EMAIL_USER}>`,
      to: userEmail,
      subject: `Payment Confirmed - Order #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #28a745; color: white; padding: 20px; text-align: center;">
            <h1>✅ Payment Confirmed</h1>
            <h2>Order #${order._id}</h2>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h3>Great news, ${user.name}!</h3>
            <p>Your payment has been successfully processed and your order is now being prepared for shipment.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>Payment Details</h4>
              <p><strong>Amount Paid:</strong> $${order.totalPrice.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> ${order.paymentProvider?.toUpperCase() || order.paymentMethod.toUpperCase()}</p>
              <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h4>What's Next?</h4>
              <ol>
                <li>Your order will be processed within 24 hours</li>
                <li>You'll receive shipping confirmation with tracking details</li>
                <li>Estimated delivery: 5-7 business days</li>
              </ol>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} Gadgetra Store. All rights reserved.</p>
            <p>Need help? Contact us at support@gadgetra.com</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Payment confirmation email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
  }
};

export const testEmailConnection = async () => {
  try {
    const mailOptions = {
      from: `"Gadgetra Store" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: "Email Service Test",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🧪 Email Service Test</h2>
          <p>This is a test email to verify that the email service is working correctly.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Status:</strong> ✅ Email service is operational</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully');
    return true;
  } catch (error) {
    console.error('Email service test failed:', error);
    return false;
  }
};
