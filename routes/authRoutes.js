const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  resetPassword,
} = require("../controllers/authController.js");
const { protect } = require("../middlewares/protect.js");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/profile", protect, getProfile);

router.put("/resetpassword", resetPassword);

module.exports = router;
