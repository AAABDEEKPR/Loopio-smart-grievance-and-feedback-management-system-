const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//  SECURITY MIDDLEWARE
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));

//  RATE LIMITING
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 1000, // Limit each IP to 1000 requests per 10 mins
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

//  MIDDLEWARE 
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION 
mongoose.connect(
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedback_app'
)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        console.log('Make sure MongoDB is installed and running!');
    });

//  ROUTES 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/feedbacks', require('./routes/feedback'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/uploads', express.static('uploads'));

//  DEFAULT ROUTE 
app.get('/', (req, res) => {
    res.send('Feedback API is running');
});

//  ERROR HANDLER
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
