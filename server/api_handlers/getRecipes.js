// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");
const { NAME_COLLATION } = require("../helpers/validateRecipe");
const ingredientsForRecipes = require("../helpers/ingredientsForRecipes");

// GET /api/recipes  -> the logged-in user's recipes (A to Z) + the ingredients they use
// (protected by requireAuth, so req.userId is the logged-in user)
const getRecipes = async (req, res) => {
    try {
        const recipes = await db
            .collection("recipes")
            .find({ ownerId: req.userId })
            .collation(NAME_COLLATION) // sort A to Z ignoring capitals
            .sort({ name: 1 })
            .toArray();

        const ingredients = await ingredientsForRecipes(recipes, req.userId);

        // An empty list is not an error: 200 with []
        return res.status(200).json({ status: 200, recipes, ingredients });
    } catch (err) {
        console.error("getRecipes error:", err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = getRecipes;
