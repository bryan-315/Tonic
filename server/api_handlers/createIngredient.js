// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");
const { validateIngredient, NAME_COLLATION } = require("../helpers/validateIngredient");

// POST /api/ingredients  (protected by requireAuth, so req.userId is the logged-in user)
const createIngredient = async (req, res) => {
    try {
        // Check and clean everything the browser sent
        const { error, value } = validateIngredient(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error });
        }

        const ingredients = db.collection("ingredients");

        // Block duplicate names for the SAME user, ignoring upper/lowercase.
        // Two different users can both have a "Whey".
        const duplicate = await ingredients.findOne(
            { ownerId: req.userId, name: value.name },
            { collation: NAME_COLLATION }
        );
        if (duplicate) {
            return res.status(409).json({ status: 409, message: `You already have an ingredient called "${duplicate.name}".` });
        }

        const newIngredient = {
            ...value,
            // Owner comes from the login token, never from req.body
            ownerId: req.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await ingredients.insertOne(newIngredient);
        return res.status(201).json({
            status: 201,
            message: "Ingredient created",
            ingredient: { ...newIngredient, _id: result.insertedId },
        });
    } catch (err) {
        console.error("createIngredient error:", err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = createIngredient;
