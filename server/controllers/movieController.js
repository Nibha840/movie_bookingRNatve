// server/controllers/movieController.js
const db = require('../config/db');

// Auto-fix: Ensure movies table has 'genre' column
db.query("SHOW COLUMNS FROM movies LIKE 'genre'", (err, results) => {
    if (!err && results && results.length === 0) {
        db.query("ALTER TABLE movies ADD COLUMN genre VARCHAR(50) DEFAULT 'General'", (alterErr) => {
            if (alterErr) {
                console.log('⚠️  Could not add genre column:', alterErr.message);
            } else {
                console.log('✅ Added missing "genre" column to movies table');
            }
        });
    }
});

// GET ALL MOVIES
exports.getAllMovies = (req, res) => {
    const sql = "SELECT * FROM movies";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Get Movies Error:', err.message);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};

// ADD A NEW MOVIE (Admin Only)
exports.createMovie = (req, res) => {
    const { title, description, poster_url, genre } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Movie title is required" });
    }

    const sql = "INSERT INTO movies (title, description, poster_url, genre) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [title, description || '', poster_url || '', genre || 'General'], (err, result) => {
        if (err) {
            console.error('❌ Add Movie Error:', err.message);
            console.error('   SQL:', err.sql);
            
            // If genre column doesn't exist, try without it
            if (err.message.includes('genre')) {
                const fallbackSql = "INSERT INTO movies (title, description, poster_url) VALUES (?, ?, ?)";
                db.query(fallbackSql, [title, description || '', poster_url || ''], (err2, result2) => {
                    if (err2) {
                        console.error('❌ Fallback Add Movie Error:', err2.message);
                        return res.status(500).json({ error: "Database error: " + err2.message });
                    }
                    res.status(201).json({ message: "Movie added successfully!", movieId: result2.insertId });
                });
                return;
            }
            
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        res.status(201).json({ message: "Movie added successfully!", movieId: result.insertId });
    });
};

// UPDATE A MOVIE (Admin Only)
exports.updateMovie = (req, res) => {
    const { id } = req.params;
    const { title, description, poster_url, genre } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Movie title is required" });
    }

    const sql = "UPDATE movies SET title = ?, description = ?, poster_url = ?, genre = ? WHERE id = ?";

    db.query(sql, [title, description || '', poster_url || '', genre || 'General', id], (err, result) => {
        if (err) {
            console.error('❌ Update Movie Error:', err.message);
            return res.status(500).json({ error: "Database error: " + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Movie not found" });
        }
        res.json({ message: "Movie updated successfully!" });
    });
};