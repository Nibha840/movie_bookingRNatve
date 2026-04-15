// server/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// GET /api/payment/key - Get Razorpay public key
router.get('/key', paymentController.getKey);

// POST /api/payment/create-order - Create a Razorpay order
router.post('/create-order', paymentController.createOrder);

// POST /api/payment/verify - Verify payment signature
router.post('/verify', paymentController.verifyPayment);

module.exports = router;