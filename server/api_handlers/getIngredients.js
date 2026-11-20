// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");
const { NAME_COLLATION } = require("../helpers/validateIngredient");

// GET /api/ingredients  -> the logged-in user's ingredients, A to Z
// (protected by requireAuth, so req.userId is the logged-in user)
const getIngredients = async (req, res) => {
    try {
        const ingredients = await db
            .collection("ingredients")
            .find({ ownerId: req.userId })
            // Same collation as the duplicate check, so "apple" and "Banana" sort A to Z
            // together instead of all capitals first
            .collation(NAME_COLLATION)
            .sort({ name: 1 })
            .toArray();

        // An empty list is not an error: 200 with []
        return res.status(200).json({ status: 200, ingredients });
    } catch (err) {
        console.error("getIngredients error:", err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = getIngredients;
