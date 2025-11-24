// routes/users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // for password hashing
const sqlite3 = require('sqlite3').verbose(); // SQLite3 database

// database setup
// initialize SQLite database, the file users.db will store user data
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) console.error('DB connection error:', err);
    else console.log('Connected to SQLite DB');
});

// create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`);

// register, handles new user registration
router.post('/register', async (req, res) => {
    console.log("Register request body:", req.body);
    const { name, email, password } = req.body;

    // validate incoming request
    if (!name || !email || !password)
        return res.status(400).json({ message: "All fields are required" });

    try {
        // hash the password before storing it, generate salted hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert user into database, use parameterized query to prevent SQL injection
        db.run(
            `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
            [name, email, hashedPassword],
            function (err) {
                if (err) {
                    // if email already exists, send conflict error
                    if (err.message.includes('UNIQUE'))
                        return res.status(409).json({ message: "Email already registered" });
                    // for any other DB error
                    return res.status(500).json({ message: "DB error", error: err.message });
                }
                // success returns new user info (excluding password)
                res.json({ 
                    message: "User registered successfully", 
                    user: { id: this.lastID, name, email } 
                });
            }
        );
    } catch (err) {
        // catch any unexpected server errors
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// login, handles user login
router.post('/login', (req, res) => {
    console.log("Login request body:", req.body);
    const { email, password } = req.body;

    // validate incoming request
    if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });

    // look up user by email in database
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ message: "DB error", error: err.message });
        // if user not found
        if (!user) return res.status(401).json({ message: "Invalid email or password" });
        // compare password with hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid email or password" });
        // success, return user info (excluding password)
        res.json({ id: user.id, name: user.name, email: user.email });
    });
});

module.exports = router;


