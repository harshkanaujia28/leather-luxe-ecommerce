import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // create user with plain password (will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password, // ⚡️ plain password, will be auto-hashed
      role,
      isVerified: false,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 min valid
    });

    // send OTP email
    await sendEmail(
      email,
      "Verify your account",
      `<h2>Welcome to Zafrine!</h2>
       <p>Your verification code is: <b>${otp}</b></p>
       <p>This code will expire in 10 minutes.</p>`
    );

    res
      .status(201)
      .json({ message: "User registered, please verify OTP", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== Number(otp) || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // mark as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "User verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Forgot Password Handler
// Forgot Password Handler
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
    
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const FRONTEND_URL =
      process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    await sendEmail(
      user.email,
      "Zafrine Password Reset Request",
      `<p>Hello ${user.name || "User"},</p>
       <p>We received a request to reset your password. Click the link below to proceed:</p>
       <p><a href="${resetLink}">Reset Password</a></p>
       <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
       <p>— The Zafrine Team</p>`
    );
  res
  
      .status(200)
      .json({ status: "success", message: "Reset link sent to your email" });
      console.log("Sending reset link to:", email, "Token:", resetToken);

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// Reset Password Handler
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log(`[Reset Password] Request received with token: ${token}`);

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log(`[Reset Password] No user found for token: ${token}`);
      return res.status(404).json({
        status: "error",
        message: "User not found. Please request a new password reset.",
      });
    }

    // ✅ Let the pre('save') hook handle hashing
    user.password = password; 
    await user.save();

    console.log(`[Reset Password] Password successfully reset for: ${user.email}`);

    return res.status(200).json({
      status: "success",
      message: "Password has been reset successfully. Please log in.",
      redirect: "/login",
    });
  } catch (err) {
    console.error("[Reset Password] Error:", err);

    const message =
      err.name === "TokenExpiredError"
        ? "The reset link has expired. Please request a new one."
        : "Invalid reset link. Please request a new password reset.";

    return res.status(400).json({
      status: "error",
      message,
    });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, { httpOnly: true });
    res.json({ user, token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, email, address, city, state, country, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 Email update with duplicate check
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // 🔹 Update other profile fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.city = city || user.city;
    user.state = state || user.state;
    user.country = country || user.country;

    // 🔹 Password update (plain set, pre-save hook will hash)
    if (password) {
      user.password = password;
    }

    await user.save();

    // 🔹 Return updated profile without password
    const updatedUser = await User.findById(user._id).select("-password");
    res.json({ user: updatedUser });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


