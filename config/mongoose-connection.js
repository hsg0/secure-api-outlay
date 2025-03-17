const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB from mongoose-connection.js");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

module.exports = connectDB;
