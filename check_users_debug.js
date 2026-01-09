const mongoose = require('mongoose');
const User = require('./backend/models/User'); // Adjust path as needed
require('dotenv').config({ path: './backend/.env' });

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const admins = await User.find({ role: 'admin' });
        const devs = await User.find({ role: 'developer' });

        console.log('--- ADMINS ---');
        admins.forEach(u => console.log(`Name: ${u.name}, Email: ${u.email}, ID: ${u._id}`));

        console.log('\n--- DEVELOPERS ---');
        devs.forEach(u => console.log(`Name: ${u.name}, Email: ${u.email}, ID: ${u._id}`));

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

checkUsers();
