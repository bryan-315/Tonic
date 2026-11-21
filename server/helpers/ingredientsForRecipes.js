// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");

// Given some recipes, load every ingredient they use (each one only once).
// The website needs these to calculate totals, because a recipe only stores
// { ingredientId, amount, unit }, not the macros themselves.
// (That's on purpose: fix a typo in an ingredient and every recipe updates.)
const ingredientsForRecipes = async (recipes, userId) => {
    const ids = recipes.flatMap((recipe) => recipe.lines.map((line) => line.ingredientId));
    if (ids.length === 0) return [];

    return db
        .collection("ingredients")
        // ownerId filter: only ever send the user their own ingredients
        .find({ _id: { $in: ids }, ownerId: userId })
        .toArray();
};

module.exports = ingredientsForRecipes;
