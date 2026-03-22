import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const EMAIL_USER = (process.env.EMAIL_USER || "").trim();
const EMAIL_PASS = (process.env.EMAIL_PASS || "").trim();

const testConfigs = [
  {
    name: "Gmail Port 587 (STARTTLS)",
    config: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      logger: true,
      debug: true
    }
  },
  {
    name: "Gmail Port 465 (SSL)",
    config: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      logger: true,
      debug: true
    }
  }
];

async function runTests() {
  console.log("Starting Email Connection Tests...");
  console.log(`User: '${EMAIL_USER}'`);
  console.log(`Pass: ${EMAIL_PASS ? "****" : "MISSING"}`);

  for (const { name, config } of testConfigs) {
    console.log(`\nTesting: ${name}...`);
    const transporter = nodemailer.createTransport(config);

    try {
      await transporter.verify();
      console.log(`✅ ${name} Connection Successful!`);
      
      const info = await transporter.sendMail({
        from: `"Test" <${EMAIL_USER}>`,
        to: EMAIL_USER,
        subject: "Gadgetra Email Test",
        text: "If you received this, your email configuration is working!",
      });
      console.log(`✅ Message sent: ${info.messageId}`);
    } catch (error) {
      console.error(`❌ ${config.name} failed:`, error.message);
    }
  }
}

runTests();
