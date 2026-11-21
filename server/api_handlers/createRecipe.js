// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");
const { validateRecipe, checkRecipeIngredients, NAME_COLLATION } = require("../helpers/validateRecipe");

// POST /api/recipes  (protected by requireAuth, so req.userId is the logged-in user)
const createRecipe = async (req, res) => {
    try {
        // 1. Is the data the right shape?
        const { error, value } = validateRecipe(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error });
        }

        // 2. Are the ingredients yours, and does each line use one of their units?
        const check = await checkRecipeIngredients(value.lines, req.userId);
        if (check.error) {
            return res.status(400).json({ status: 400, message: check.error });
        }

        const recipes = db.collection("recipes");

        // 3. Same name already used by this user? (ignoring capitals)
        const duplicate = await recipes.findOne(
            { ownerId: req.userId, name: value.name },
            { collation: NAME_COLLATION }
        );
        if (duplicate) {
            return res.status(409).json({ status: 409, message: `You already have a recipe called "${duplicate.name}".` });
        }

        // 4. Save
        const newRecipe = {
            ...value,
            // Owner comes from the login token, never from req.body
            ownerId: req.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await recipes.insertOne(newRecipe);

        return res.status(201).json({
            status: 201,
            message: "Recipe created",
            recipe: { ...newRecipe, _id: result.insertedId },
            // The ingredients it uses, so the website can show totals right away
            ingredients: check.ingredients,
        });
    } catch (err) {
        console.error("createRecipe error:", err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = createRecipe;
