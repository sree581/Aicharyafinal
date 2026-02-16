const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080; // Matching default Spring Boot port or 8080

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authController = require('./controllers/authController');
const aiController = require('./controllers/aiController');
const learningController = require('./controllers/learningController');

app.use('/auth', authController);
app.use('/ai', aiController);
app.use('/learning', learningController);

// Basic route
app.get('/', (req, res) => {
    res.send('Aicharya Node.js Backend is running!');
});

// Sync Database and Start Server
const User = require('./models/User');
const Course = require('./models/Course');

db.sync().then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});
