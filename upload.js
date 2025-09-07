// upload.js
const multer = require("multer");
const path = require("path");

// Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads")); // ✅ uploads folder me save karega
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
