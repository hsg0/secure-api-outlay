const jwt = require("jsonwebtoken");

module.exports.protect = async (req, res, next) => {
  if (req.cookies.token) {
    try {
      const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      let user = await userModel.findOne({ email: data.email });
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
};
// Compare this snippet from routes/authRoutes.js:
