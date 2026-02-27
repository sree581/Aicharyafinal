const express = require('express');
const router = express.Router();
const User = require('../models/User');  // IMPORT USER MODEL

// 🔹 SIGNUP (Create User)
router.post('/signup', async (req, res) => {
    try {

        const existingUser = await User.findOne({
            where: { email: req.body.email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = await User.create(req.body);
        res.json(user);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 🔹 LOGIN (Just check if email exists for now)
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.body.email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 GET ALL USERS (for testing)
router.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

module.exports = router;