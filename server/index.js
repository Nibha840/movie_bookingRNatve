const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes'); 
const sendEmail = require('./utils/emailService');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Use Routes
// Note: We add the prefix '/api/auth' here. 
// So the URL becomes: http://localhost:5000/api/auth/login
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.use('/api/bookings', bookingRoutes); 
app.use('/api/payment', paymentRoutes); 

// Test email endpoint - hit this to verify email is working
app.post('/api/test-email', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    const success = await sendEmail(
        email,
        'Test Email from Movie App ✅',
        'If you received this email, your email service is working correctly!\n\n- Movie App Team'
    );
    
    if (success) {
        res.json({ message: `Test email sent to ${email}` });
    } else {
        res.status(500).json({ error: 'Failed to send email. Check server logs.' });
    }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Phone access: http://10.12.34.23:${PORT}`);
});
