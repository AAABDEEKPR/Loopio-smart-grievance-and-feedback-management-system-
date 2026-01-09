const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    console.log(`DEBUG EMAIL: Host=${process.env.SMTP_HOST} Port=465 User=${process.env.SMTP_EMAIL}`);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        logger: true,
        debug: true,
        connectionTimeout: 10000, // 10 seconds timeout
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail;
