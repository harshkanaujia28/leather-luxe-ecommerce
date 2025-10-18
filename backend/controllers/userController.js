import User from "../models/User.js";



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password") // Don't send passwords
    res.status(200).json({ users })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}


// GET single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("orders");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ user: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
