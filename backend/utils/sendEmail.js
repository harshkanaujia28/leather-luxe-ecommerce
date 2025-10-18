import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // smtp.gmail.com
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // true if port 465
      auth: {
        user: process.env.EMAIL_USER, // info@zafrine.in
        pass: process.env.EMAIL_PASS, // Google Workspace App Password
      },
    });

    const mailOptions = {
      from: `"KOZA" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Failed to send email"); // will propagate to /forgot-password
  }
};
