// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");
const { validateIngredient, NAME_COLLATION } = require("../helpers/validateIngredient");
const findOwnIngredient = require("../helpers/findOwnIngredient");

// PATCH /api/ingredients/:id  (protected by requireAuth, so req.userId is the logged-in user)
// The edit form always sends the WHOLE ingredient, so it goes through the exact same
// validation as create. Simpler than checking which fields happened to be sent.
const editIngredient = async (req, res) => {
    try {
        // 1. Does it exist, and is it yours?
        const found = await findOwnIngredient(req.params.id, req.userId);
        if (!found.ingredient) {
            return res.status(found.status).json({ status: found.status, message: found.message });
        }

        // 2. Is the new data valid?
        const { error, value } = validateIngredient(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error });
        }

        const ingredients = db.collection("ingredients");

        // 3. Renaming to a name you already use? (ignore THIS ingredient itself,
        //    so saving "Whey" without renaming it isn't flagged as a duplicate)
        const duplicate = await ingredients.findOne(
            { ownerId: req.userId, name: value.name, _id: { $ne: found.ingredient._id } },
            { collation: NAME_COLLATION }
        );
        if (duplicate) {
            return res.status(409).json({ status: 409, message: `You already have an ingredient called "${duplicate.name}".` });
        }

        // 4. Save
        const updated = { ...value, updatedAt: new Date() };
        await ingredients.updateOne({ _id: found.ingredient._id }, { $set: updated });

        return res.status(200).json({
            status: 200,
            message: "Ingredient updated",
            ingredient: { ...found.ingredient, ...updated },
        });
    } catch (err) {
        console.error("editIngredient error:", err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = editIngredient;
