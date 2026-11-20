// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");

// GET /api/me  -> "who am I?"
// Protected by requireAuth, so req.userId comes from the verified login token.
// The website calls this when it loads, to check the saved login is still valid
// and to get fresh user info.
const getMe = async (req, res) => {
    try {
        const user = await db.collection("users").findOne({ _id: req.userId });

        // The token is valid but the account no longer exists (e.g. it was deleted)
        if (!user) {
            return res.status(401).json({ status: 401, message: "Please log in again." });
        }

        // Passwords never leave the server
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ status: 200, user: userWithoutPassword });
    } catch (err) {
        console.error("getMe error:", err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = getMe;
