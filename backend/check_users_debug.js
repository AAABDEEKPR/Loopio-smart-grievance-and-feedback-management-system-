const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedback_app');
        console.log('Connected to DB');

        const admins = await User.find({ role: 'admin' });
        const devs = await User.find({ role: 'developer' });

        console.log('--- ADMINS ---');
        admins.forEach(u => console.log(`Name: ${u.name}, Email: ${u.email}`));

        console.log('\n--- DEVELOPERS ---');
        devs.forEach(u => console.log(`Name: ${u.name}, Email: ${u.email}`));

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

checkUsers();
