// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");
const findOwn = require("../helpers/findOwn");

// DELETE /api/recipes/:id  (protected by requireAuth, so req.userId is the logged-in user)
// Nothing else depends on recipes (the diary will keep its own copies), so a real delete is fine.
const deleteRecipe = async (req, res) => {
    try {
        const found = await findOwn("recipes", req.params.id, req.userId, "Recipe");
        if (!found.doc) {
            return res.status(found.status).json({ status: found.status, message: found.message });
        }

        await db.collection("recipes").deleteOne({ _id: found.doc._id });
        return res.status(200).json({ status: 200, message: "Recipe deleted" });
    } catch (err) {
        console.error("deleteRecipe error:", err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = deleteRecipe;
