const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");

    res.render("profile", { user }); // views/profile.ejs
  } catch (err) {
    console.error("❌ Error loading profile:", err);
    res.status(500).send("Error while loading profile");
  }
});

module.exports = router;
