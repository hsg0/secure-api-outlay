const bcrypt = require("bcryptjs");
const User = require("../models/user-model.js"); // ✅ Ensure correct import
const generateToken = require("../utils/generateToken"); // Adjust path if needed

// ✅ REGISTER USER
module.exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      // ✅ FIXED
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate token
    const token = generateToken({ email });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ LOGIN USER
module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }); // ✅ FIXED
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({ email });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ LOGOUT USER
module.exports.logoutUser = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) }); // Clears the cookie
  res.status(200).json({ message: "Logged out successfully" });
};

// ✅ GET USER PROFILE
module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select(
      "-password"
    ); // ✅ FIXED
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ RESET PASSWORD
module.exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    let user = await User.findOne({ email }); // ✅ FIXED
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
