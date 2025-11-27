const jwt = require('jsonwebtoken');                // Import JWT library
const User = require('../models/User');             // Import User model

// Middleware to protect routes (only logged-in users can access)
const protect = async (req, res, next) => {
    let token;

    // Check if the request has an Authorization header and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header (split "Bearer tokenvalue")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by decoded token ID (remove password field)
            req.user = await User.findById(decoded.id).select('-password');

            next();                                     // Allow the request to continue
        } catch (error) {
            console.error(error);
            // If token is invalid or expired → send error
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token provided at all
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check user roles (Authorization)
// Example: authorize("admin"), authorize("admin", "developer")
const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if the logged-in user's role is allowed
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();                                        // Allow access if role matches
    };
};

module.exports = { protect, authorize };              // Export both middlewares
