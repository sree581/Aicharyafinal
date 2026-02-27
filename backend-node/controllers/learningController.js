const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Create course
router.post('/courses', async (req, res) => {
    try {
        const { courseName, description, classNumber } = req.body;

        if (!courseName || !description) {
            return res.status(400).json({
                message: "Course name and description are required"
            });
        }

        const newCourse = await Course.create({
            courseName,
            description,
            classNumber
        });

        res.status(201).json(newCourse);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;