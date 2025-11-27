const User = require('../models/User');          // Importing the User model
const jwt = require('jsonwebtoken');             // Importing JWT library

// Function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',                        // Token will expire after 30 days
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;     // Getting data from request body

    try {
        if (!name || !email || !password) {               // Check if any field is missing
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if the user already exists by email
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' }); // If found, stop
        }

        // Create a new user in the database
        const user = await User.create({
            name,
            email,
            password,                                      // Password hashing happens in model
            role: role || 'user'                           // Default role is "user"
        });

        if (user) {
            res.status(201).json({
                _id: user.id,                              // User ID
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id)              // Generate and return JWT token
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);                              // Log any server errors
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;                  // Getting login details

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id)              // Return token on successful login
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' }); // Wrong email or password
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get logged-in user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);                        // Return user data from middleware
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);     // Find the current logged-in user

        if (user) {
            user.name = req.body.name || user.name;        // Update name
            user.email = req.body.email || user.email;     // Update email

            if (req.body.password) {                       // If password provided, update it
                user.password = req.body.password;
            }

            const updatedUser = await user.save();         // Save to database

            res.json({
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser.id)       // Give new token after updating
            });
        } else {
            res.status(404).json({ message: 'User not found' }); // If user doesn't exist
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all developers
// @route   GET /api/auth/developers
// @access  Private
const getDevelopers = async (req, res) => {
    try {
        // Find users with role "developer"
        const developers = await User.find({ role: 'developer' })
            .select('-password');                          // Do not return password for safety

        res.json(developers);                              // Return developer list
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateUserProfile,
    getDevelopers
};
