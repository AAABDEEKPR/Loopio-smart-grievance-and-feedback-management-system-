const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const TEST_EMAIL = 'testadmin_' + Date.now() + '@example.com';
const TEST_PASS = '123456';
const SERVER_URL = 'http://localhost:5000/api/auth';

const runTest = async () => {
    let mongoConnected = false;
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedback_app');
        mongoConnected = true;

        console.log(`Creating Admin: ${TEST_EMAIL}`);
        const user = await User.create({
            name: 'Test Admin',
            email: TEST_EMAIL,
            password: TEST_PASS,
            role: 'admin'
        });

        // Login
        console.log('Logging in...');
        const loginRes = await fetch(`${SERVER_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful, got token.');

        // Update Profile
        console.log('Attempting profile update...');
        const updateRes = await fetch(`${SERVER_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: 'Updated Admin Name', email: TEST_EMAIL })
        });

        const updateData = await updateRes.json();
        console.log('Update Response:', updateData);

        if (updateData.name === 'Updated Admin Name') {
            console.log('SUCCESS: Admin profile updated.');
        } else {
            console.log('FAILURE: Name did not change.');
        }

        // Cleanup
        await User.deleteOne({ _id: user._id });
        console.log('Cleanup done.');

    } catch (error) {
        console.error('TEST FAILED:', error);
    } finally {
        if (mongoConnected) mongoose.disconnect();
    }
};

runTest();
