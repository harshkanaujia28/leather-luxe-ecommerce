import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    role: { type: String, enum: ["admin", "user"], default: "user" },

    // OTP fields for verification
    isVerified: { type: Boolean, default: false },
    otp: Number,
    otpExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);
