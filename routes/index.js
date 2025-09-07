const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const upload = require("../utils/multer");

// GET Home Page
router.get("/", (req, res) => {
  res.render("index", { title: "Express" });
});

// GET Signup Page
router.get("/signup", (req, res) => {
  res.render("signup");
});


// POST Signup (with profile picture upload)
router.post("/signup", upload.single("profilePic"), async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      profilePic: req.file ? "/uploads/" + req.file.filename : "",
    });

    await user.save();
    console.log("✅ User created:", user);
    res.redirect("/signup-successfully");
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).send("Error during signup.");
  }
});

// Profile route
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

// GET Profile
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // 👇 yaha user bhejna zaroori hai
    res.render("profile", { user });
  } catch (err) {
    console.error("❌ Profile error:", err);
    res.status(500).send("Error loading profile");
  }
});

// GET Signup Success Page
router.get("/signup-successfully", (req, res) => {
  res.render("signup-successfully"); // Make sure views/signup-successfully.ejs exists
});

// GET Login Page
router.get("/login", (req, res) => {
  res.render("login");
  req.session.userId = user._id;
  res.redirect(`/profile/${user._id}`);

});

// POST Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid email or password.");
    }

    console.log("✅ Login successful:", user.email);
    res.send("Login Successful!");
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).send("Error during login.");
  }
});

module.exports = router;
