import jwt from "jsonwebtoken";
import User from "../models/User.js"

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ fetch full user to get role
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Token failed:", error);
      return res.status(403).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "No token" });
  }
};
