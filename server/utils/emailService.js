// server/utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // .env load karo

const sendEmail = async (userEmail, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // .env se aayega (Aapka App Email)
            pass: process.env.EMAIL_PASS  // .env se aayega (App Password)
        },
        // ADD THIS BLOCK TO FIX THE ERROR:
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: `"Movie App" <${process.env.EMAIL_USER}>`, // Bhejne wala (App)
        to: userEmail,                                    // Paane wala (Dynamic User)
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(` Email sent to ${userEmail}`);
    } catch (error) {
        console.error(' Error sending email:', error);
    }
};

module.exports = sendEmail;