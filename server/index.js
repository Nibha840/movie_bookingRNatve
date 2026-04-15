const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes'); 

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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

