const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const User = require('./models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkNotifications = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedback_app');
        console.log('Connected to DB');

        const notifications = await Notification.find({}).populate('recipient', 'name email');
        console.log(`Total Notifications: ${notifications.length}`);

        notifications.forEach(n => {
            console.log(`- To: ${n.recipient?.name} (${n.recipient?.email}) | Msg: ${n.message} | Read: ${n.read}`);
        });

        const users = await User.find({});
        console.log('\nUsers:');
        users.forEach(u => console.log(`- ${u.name} (${u.role}): ${u._id}`));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkNotifications();
