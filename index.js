const express = require("express");
const app = express();
const port = 3000; // Port number
require("dotenv").config();
const connectDB = require("./config/mongoose-connection.js");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes.js");

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(cookieParser()); // Parse cookies from the HTTP Request

// Connect to MongoDB
connectDB();

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
