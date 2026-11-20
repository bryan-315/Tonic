const findOwnIngredient = require("../helpers/findOwnIngredient");

// GET /api/ingredients/:id  -> one of the logged-in user's ingredients (for the edit page)
// (protected by requireAuth, so req.userId is the logged-in user)
const getOneIngredient = async (req, res) => {
    try {
        const found = await findOwnIngredient(req.params.id, req.userId);
        if (!found.ingredient) {
            return res.status(found.status).json({ status: found.status, message: found.message });
        }
        return res.status(200).json({ status: 200, ingredient: found.ingredient });
    } catch (err) {
        console.error("getOneIngredient error:", err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = getOneIngredient;
