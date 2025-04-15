const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (email, username) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail or another email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"Your E-Commerce" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Our Store!",
      html: `<h2>Hello, ${username}!</h2>
             <p>Thank you for signing up at our e-commerce store. 🎉 Happy shopping!</p>`,
    });

    console.log("✅ Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = sendMail;
