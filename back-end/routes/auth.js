const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, language } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const user = new User({ username, email, password, language });
    await user.save();

    res.json({ msg: "User created" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        language: user.language,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/me/language", auth, async (req, res) => {
  try {
    const { language } = req.body;
    const allowed = ["ca", "es", "en"];
    if (!allowed.includes(language)) {
      return res.status(400).json({ msg: "Invalid language" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { language },
      { new: true, select: "-password" },
    );

    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
