const findOwn = require("../helpers/findOwn");
const ingredientsForRecipes = require("../helpers/ingredientsForRecipes");

// GET /api/recipes/:id  -> one of the logged-in user's recipes + the ingredients it uses
// (protected by requireAuth, so req.userId is the logged-in user)
const getOneRecipe = async (req, res) => {
    try {
        const found = await findOwn("recipes", req.params.id, req.userId, "Recipe");
        if (!found.doc) {
            return res.status(found.status).json({ status: found.status, message: found.message });
        }

        const ingredients = await ingredientsForRecipes([found.doc], req.userId);
        return res.status(200).json({ status: 200, recipe: found.doc, ingredients });
    } catch (err) {
        console.error("getOneRecipe error:", err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = getOneRecipe;
