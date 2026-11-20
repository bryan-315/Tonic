// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");
const findOwnIngredient = require("../helpers/findOwnIngredient");

// DELETE /api/ingredients/:id  (protected by requireAuth, so req.userId is the logged-in user)
// For now this is a real delete, because no recipes use ingredients yet.
// In Feature 4 (recipes) this gets the "used in 2 recipes" choice and soft delete.
const deleteIngredient = async (req, res) => {
    try {
        const found = await findOwnIngredient(req.params.id, req.userId);
        if (!found.ingredient) {
            return res.status(found.status).json({ status: found.status, message: found.message });
        }

        await db.collection("ingredients").deleteOne({ _id: found.ingredient._id });
        return res.status(200).json({ status: 200, message: "Ingredient deleted" });
    } catch (err) {
        console.error("deleteIngredient error:", err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = deleteIngredient;
