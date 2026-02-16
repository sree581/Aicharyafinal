const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.get('/generateLesson', (req, res) => {
    const topic = req.query.topic || 'Java';
    const response = aiService.generateLesson(topic);
    res.send(response);
});

module.exports = router;
