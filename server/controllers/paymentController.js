// server/controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance with keys from .env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * GET /api/payment/key
 * Returns the Razorpay Key ID to the frontend (this is a PUBLIC key, safe to share)
 */
exports.getKey = (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
};

/**
 * POST /api/payment/create-order
 * Creates a Razorpay order with the given amount
 * Body: { amount: 500 } (amount in rupees)
 */
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Valid amount is required" });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in PAISE (₹500 = 50000 paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                app: "MovieBookingApp",
            },
        };

        const order = await razorpay.orders.create(options);

        console.log("✅ Razorpay Order Created:", order.id);

        res.status(200).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("❌ Razorpay Order Error:", error.message);
        res.status(500).json({
            error: "Failed to create payment order",
            details: error.message,
        });
    }
};

/**
 * POST /api/payment/verify
 * Verifies the Razorpay payment signature
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
exports.verifyPayment = (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: "Missing payment verification details" });
        }

        // Create the expected signature using HMAC SHA256
        // Formula: HMAC_SHA256(order_id + "|" + payment_id, secret)
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        // Compare signatures
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            console.log("✅ Payment Verified:", razorpay_payment_id);
            res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                transactionId: razorpay_payment_id,
                orderId: razorpay_order_id,
            });
        } else {
            console.error("❌ Payment Verification Failed - Signature Mismatch");
            res.status(400).json({
                success: false,
                error: "Payment verification failed - Invalid signature",
            });
        }
    } catch (error) {
        console.error("❌ Payment Verification Error:", error.message);
        res.status(500).json({
            error: "Payment verification failed",
            details: error.message,
        });
    }
};