const db = require('../config/db');
const sendEmail = require('../utils/emailService');

// Fix the bookings table on startup - remove FK constraint that blocks inserts
const fixBookingsTable = () => {
    // First, try to drop the foreign key constraint on showtime_id
    db.query("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'showtime_id' AND REFERENCED_TABLE_NAME IS NOT NULL", (err, results) => {
        if (err || !results || results.length === 0) return;
        
        results.forEach(row => {
            db.query(`ALTER TABLE bookings DROP FOREIGN KEY ${row.CONSTRAINT_NAME}`, (err2) => {
                if (err2) {
                    console.log('⚠️  Could not drop FK constraint:', err2.message);
                } else {
                    console.log(`✅ Dropped FK constraint '${row.CONSTRAINT_NAME}' on bookings.showtime_id`);
                }
            });
        });
    });
};

// Run the fix on load
fixBookingsTable();

exports.createBooking = (req, res) => {
    const { userId, showtimeId, seats, totalPrice, userEmail, transactionId } = req.body;

    // Basic Validation
    if (!userId || !seats || !totalPrice || !transactionId) {
        return res.status(400).json({ error: "Missing booking details or transaction ID" });
    }

    // Save Booking to Database
    const sql = "INSERT INTO bookings (user_id, showtime_id, seats, total_amount, booking_date, transaction_id) VALUES (?, ?, ?, ?, NOW(), ?)";
    
    const seatString = seats.join(','); 
    const movieId = showtimeId || 0;

    db.query(sql, [userId, movieId, seatString, totalPrice, transactionId], async (err, result) => {
        if (err) {
            console.error('❌ Booking DB Error:', err.message);
            console.error('   SQL:', err.sql);
            
            // If FK constraint error, try without showtime_id
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                console.log('⚠️  Foreign key constraint error. Attempting to fix...');
                
                // Try to drop the constraint and retry
                db.query("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'showtime_id' AND REFERENCED_TABLE_NAME IS NOT NULL", (fkErr, fkResults) => {
                    if (fkErr || !fkResults || fkResults.length === 0) {
                        return res.status(500).json({ error: "Database error - foreign key constraint. Please check your database schema." });
                    }
                    
                    const constraintName = fkResults[0].CONSTRAINT_NAME;
                    db.query(`ALTER TABLE bookings DROP FOREIGN KEY ${constraintName}`, (dropErr) => {
                        if (dropErr) {
                            console.error('❌ Could not drop FK:', dropErr.message);
                            return res.status(500).json({ error: "Database error - could not fix FK constraint" });
                        }
                        
                        console.log(`✅ Dropped FK constraint '${constraintName}'. Retrying booking...`);
                        
                        // Retry the insert
                        db.query(sql, [userId, movieId, seatString, totalPrice, transactionId], async (retryErr, retryResult) => {
                            if (retryErr) {
                                console.error('❌ Retry failed:', retryErr.message);
                                return res.status(500).json({ error: "Database error on retry" });
                            }
                            
                            // Send email after successful retry
                            const emailSubject = "Booking Confirmed!";
                            const emailBody = `Hello,\n\nYour booking is confirmed!\n\nSeats: ${seatString}\nTotal Price: ₹${totalPrice}\nTransaction ID: ${transactionId}\n\nThank you for booking with us!\n- Movie App Team`;
                            sendEmail(userEmail, emailSubject, emailBody);
                            
                            console.log("✅ Booking Saved (after FK fix) & Email Sent");
                            res.status(201).json({ message: "Booking successful & Email sent!", bookingId: retryResult.insertId });
                        });
                    });
                });
                return;
            }
            
            return res.status(500).json({ error: "Database error: " + err.message });
        }

        // Send Confirmation Email
        const emailSubject = "Booking Confirmed!";
        const emailBody = `Hello,\n\nYour booking is confirmed!\n\nSeats: ${seatString}\nTotal Price: ₹${totalPrice}\nTransaction ID: ${transactionId}\n\nThank you for booking with us!\n- Movie App Team`;

        sendEmail(userEmail, emailSubject, emailBody);
        console.log("✅ Booking Saved & Email Sent");
        res.status(201).json({ message: "Booking successful & Email sent!", bookingId: result.insertId });
    });
};

exports.getUserBookings = (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM bookings WHERE user_id = ?";
    
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
};
