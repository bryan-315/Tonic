const { client } = require('../db');
const bcrypt = require('bcrypt');

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ status: 400, message: 'Invalid email.' });
        }
        if (!password || typeof password !== 'string') {
            return res.status(400).json({ status: 400, message: 'Invalid password.' });
        }
        // Connect to the database
        await client.connect();
        const db = client.db('tonic');
        const users = db.collection('users');
        // Check if user exists
        cleanEmail = email.trim().toLowerCase();
        const user = await users.findOne({ email: cleanEmail });
        if (!user) {
            return res.status(400).json({ status: 400, message: 'User not found.' });
        }
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: 400, message: 'Invalid credentials.' });
        }
        // Remove password from user object before sending response
        const { password: _, ...userWithoutPassword } = user;
        // Send response
        res.status(200).json({ status: 200, data: userWithoutPassword, message: 'Login successful' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ status: 500, message: 'Server error during login.' });
    } finally {
        await client.close();
    }
}

module.exports = logIn;