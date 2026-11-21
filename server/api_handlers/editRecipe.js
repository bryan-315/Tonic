// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");
const { validateRecipe, checkRecipeIngredients, NAME_COLLATION } = require("../helpers/validateRecipe");
const findOwn = require("../helpers/findOwn");

// PATCH /api/recipes/:id  (protected by requireAuth, so req.userId is the logged-in user)
// The edit form always sends the WHOLE recipe, so it goes through the same checks as create.
const editRecipe = async (req, res) => {
    try {
        // 1. Does it exist, and is it yours?
        const found = await findOwn("recipes", req.params.id, req.userId, "Recipe");
        if (!found.doc) {
            return res.status(found.status).json({ status: found.status, message: found.message });
        }

        // 2. Is the new data the right shape?
        const { error, value } = validateRecipe(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error });
        }

        // 3. Are the ingredients yours, with valid units?
        const check = await checkRecipeIngredients(value.lines, req.userId);
        if (check.error) {
            return res.status(400).json({ status: 400, message: check.error });
        }

        const recipes = db.collection("recipes");

        // 4. Renaming to a name you already use? (ignore THIS recipe itself)
        const duplicate = await recipes.findOne(
            { ownerId: req.userId, name: value.name, _id: { $ne: found.doc._id } },
            { collation: NAME_COLLATION }
        );
        if (duplicate) {
            return res.status(409).json({ status: 409, message: `You already have a recipe called "${duplicate.name}".` });
        }

        // 5. Save
        const updated = { ...value, updatedAt: new Date() };
        await recipes.updateOne({ _id: found.doc._id }, { $set: updated });

        return res.status(200).json({
            status: 200,
            message: "Recipe updated",
            recipe: { ...found.doc, ...updated },
            ingredients: check.ingredients,
        });
    } catch (err) {
        console.error("editRecipe error:", err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = editRecipe;
