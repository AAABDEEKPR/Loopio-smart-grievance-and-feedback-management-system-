const express = require('express');              // Import Express framework to create server and routes
const mongoose = require('mongoose');            // Import Mongoose to connect with MongoDB
const cors = require('cors');                    // Import CORS to allow frontend ↔ backend communication
const dotenv = require('dotenv');                // Import dotenv to load environment variables from .env file

dotenv.config();                                 // Load variables from .env (PORT, MONGO_URI, JWT_SECRET)

const app = express();                           // Create Express app
const PORT = process.env.PORT || 5000;           // Choose PORT from .env or use 5000 as default

//  MIDDLEWARE 
app.use(cors());                                 // Enable CORS -> allows frontend to access backend
app.use(express.json());                         // Enable JSON parsing -> allows reading request body

// DATABASE CONNECTION 
mongoose.connect(                         //moongoose is a library that helps to connect with mongodb
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedback_app'  
)                                                // Connect to MongoDB using .env or fallback URL
.then(() => console.log('MongoDB Connected Successfully'))   // If connected successfully
.catch(err => {                                  // If database connection fails
    console.error('MongoDB Connection Error:', err.message); // Print error message
    console.log('Make sure MongoDB is installed and running!'); // Extra help message
});

//  ROUTES 
app.use('/api/auth', require('./routes/auth'));       // All /api/auth routes handled by routes/auth.js
app.use('/api/feedbacks', require('./routes/feedback')); // All /api/feedbacks routes handled by routes/feedback.js

//  DEFAULT ROUTE 
app.get('/', (req, res) => {                   // Simple test route
    res.send('Feedback API is running');       // Response when visiting home URL
});


app.listen(PORT, () => {                       // Start the server
    console.log(`Server running on port ${PORT}`);  // Show message in terminal
});
