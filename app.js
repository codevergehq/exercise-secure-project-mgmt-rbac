const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());

// Mock authentication middleware
app.use((req, res, next) => {
    // Simulate a logged-in user
    req.user = {
        _id: 'mockUserId',
        role: 'DEVELOPER', // Change this to test different roles
    };
    next();
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/project-mgmt')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes will be mounted here

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
