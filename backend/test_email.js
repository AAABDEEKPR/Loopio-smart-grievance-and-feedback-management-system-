
const sendEmail = require('./utils/sendEmail');
const dotenv = require('dotenv');

dotenv.config();

const testEmail = async () => {
    try {
        if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
            console.error('ERROR: Missing SMTP_EMAIL or SMTP_PASSWORD in .env');
            process.exit(1);
        }

        console.log(`Attempting to send email from: ${process.env.SMTP_EMAIL}`);

        await sendEmail({
            email: process.env.SMTP_EMAIL, // Send to self for testing
            subject: 'Test Email from Feedback App',
            message: 'If you are reading this, the email integration is working perfectly!'
        });

        console.log('SUCCESS: Email sent successfully!');
    } catch (error) {
        console.error('FAILURE: Email could not be sent.');
        console.error(error);
    }
};

testEmail();
