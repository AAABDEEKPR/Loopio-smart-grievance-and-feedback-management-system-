const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // CHECK FOR MISSING CREDENTIALS (MOCK MODE)
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.log('\n================ [ MOCK EMAIL SERVICE ] ================');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: \n${options.message}`);
        console.log('========================================================\n');
        return; // Return success to prevent crash
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or use mailtrap/ethereal for dev
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Define email options
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // Send email
    await transporter.sendMail(message);
};

module.exports = sendEmail;
