
const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware"); // 👈

router.post("/signup", signup);
router.post("/login", login);

// ✅ New route to get user info from JWT
router.get("/me", verifyToken, async (req, res) => {
  try {
    const { email, _id } = req.user; // decoded from token
    // Optionally fetch more details from DB
    const user = await require("../models/user").findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ username: user.username, email: user.email }); // or any data you want
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
