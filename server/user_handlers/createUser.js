const { client } = require("../db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Validate input
        if (!username || typeof username !== "string") {
            return res.status(400).json({ status: 400, message: "Invalid username." });
        }
        if (!email || typeof email !== "string") {
            return res.status(400).json({ status: 400, message: "Invalid email." });
        }
        if (!password || typeof password !== "string") {
            return res.status(400).json({ status: 400, message: "Invalid password." });
        }
        if (!confirmPassword || typeof confirmPassword !== "string") {
            return res.status(400).json({ status: 400, message: "Invalid confirm password." });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ status: 400, message: "Passwords do not match." });
        }

        // Check if user already exists
        await client.connect();
        console.log('in');
        const db = client.db('tonic'); 
        const users = db.collection("users");

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: "User already exists" });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanUsername = username.trim();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username: cleanUsername,
            email: cleanEmail,
            password: hashedPassword,
        };

        const result = await users.insertOne(newUser);

        res.status(201).json({ status: 201, message: "User created successfully", user: { ...newUser, _id: result.insertedId } });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ status: 500, message: "Server error during signup." });
    } finally {
        await client.close();
        console.log('out');
    }
}

module.exports = createUser;