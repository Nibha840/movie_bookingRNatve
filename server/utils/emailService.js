// server/utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (userEmail, subject, text) => {
    // Validate inputs
    if (!userEmail) {
        console.error('❌ Email Error: No recipient email provided');
        return false;
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Email Error: EMAIL_USER or EMAIL_PASS not set in .env');
        console.error('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
        console.error('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
        return false;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: `"Movie App" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: subject,
        text: text
    };

    try {
        console.log(`📧 Attempting to send email to: ${userEmail}`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${userEmail} | MessageId: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        if (error.code === 'EAUTH') {
            console.error('   → Authentication failed. Check your Gmail App Password.');
            console.error('   → Make sure 2-Step Verification is ON in Google Account.');
            console.error('   → Generate App Password at: https://myaccount.google.com/apppasswords');
        } else if (error.code === 'ESOCKET') {
            console.error('   → Network/socket error. Check internet connection.');
        }
        return false;
    }
};

module.exports = sendEmail;