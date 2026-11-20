// Everything about login tokens (JWT) lives here.
//
// Analogy: a JWT is a membership card.
// - createToken() prints a card that says "this is user 123", signed with our secret.
// - requireAuth checks the card on every protected request. If someone edits or fakes
//   the card, the signature no longer matches and the request is refused.
// The server keeps no list of logged-in users; the signed card is the proof.

require("dotenv").config();
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const { JWT_SECRET } = process.env;

// How long a login lasts before the user has to log in again
const TOKEN_LIFETIME = "30d";

// Make a token for a user. Called after a successful login or signup.
const createToken = (userId) => {
    // The "payload" is what's written on the card. Keep it small, and NEVER put
    // secrets in it: anyone holding the token can read the payload (it's only signed, not hidden).
    return jwt.sign({ userId: userId.toString() }, JWT_SECRET, { expiresIn: TOKEN_LIFETIME });
};

// Middleware: runs BEFORE a protected route's handler.
// Use it in server.js like: App.post("/api/something", requireAuth, handler)
// If the token is good, it sets req.userId (an ObjectId) and lets the request continue.
// If not, it answers 401 ("you need to log in") and the handler never runs.
const requireAuth = (req, res, next) => {
    // The browser sends the token in a header like:  Authorization: Bearer eyJhbGciOi...
    const header = req.headers.authorization;

    // Check the type before calling string methods on it (same rule as req.body)
    if (typeof header !== "string" || !header.startsWith("Bearer ")) {
        return res.status(401).json({ status: 401, message: "Please log in." });
    }

    // Cut off the word "Bearer " to keep just the token
    const token = header.slice("Bearer ".length);

    try {
        // verify() checks the signature AND the expiry date.
        // It throws an error if either is wrong, which lands in the catch below.
        const payload = jwt.verify(token, JWT_SECRET);

        // Extra safety: make sure the ID on the card is a real ObjectId
        if (!ObjectId.isValid(payload.userId)) {
            return res.status(401).json({ status: 401, message: "Please log in again." });
        }

        // Handlers use this instead of trusting a user ID from req.body
        req.userId = new ObjectId(payload.userId);
        next(); // hand the request over to the actual route handler
    } catch (err) {
        // Expired, fake or edited token: same answer for all, so we don't help attackers
        return res.status(401).json({ status: 401, message: "Your login expired. Please log in again." });
    }
};

module.exports = { createToken, requireAuth };
