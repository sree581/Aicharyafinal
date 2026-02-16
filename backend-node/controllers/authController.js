const express = require('express');
const router = express.Router();
// Service import if needed in future
// const authService = require('../services/authService');

router.get('/login', (req, res) => {
    res.send(" login API running successfully!");
});

router.post('/signup', (req, res) => {
    res.send(" signup API running successfully!");
});

module.exports = router;
