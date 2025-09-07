const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const upload = require("../upload"); // multer config
const User = require("../models/user");

// ✅ GET Signup page
router.get("/signup", (req, res) => {
  res.render("signup", { error: "Email already exists" });
});

// ✅ POST Signup
router.post("/signup", upload.single("profilepic"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilepic: req.file ? req.file.filename : null,
    });

    await newUser.save();
    console.log("✅ User saved:", newUser);

    res.redirect(`/profile/${newUser._id}`);
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).send("Error while saving user.");
  }
});

// ✅ GET Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// ✅ POST Login (secure and correct)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("❌ Login Failed: User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("❌ Login Failed: Incorrect password");
    }

    console.log("✅ User Logged In:", email);
    res.redirect(`/profile/${user._id}`);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Something went wrong during login.");
  }
});

// ✅ GET Signup Success page
router.get("/signup_successfully", (req, res) => {
  res.render("signup_successfully");
});

// ✅ GET after_login page
router.get("/after_login", (req, res) => {
  res.render("after_login");
});

// ✅ GET Profile page
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("profile", { user });
  } catch (err) {
    console.error("❌ Profile Error:", err);
    res.status(500).send("Error loading profile");
  }
});

module.exports = router;
