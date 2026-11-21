const findOwn = require("./findOwn");

// Get one ingredient by the ID in the URL, and make sure it belongs to the logged-in user.
// Used by get-one, edit and delete. The actual checks live in findOwn.js (shared with recipes).
//
// Returns one of:
//   { status: 400 | 403 | 404, message }  -> send this as the error response
//   { ingredient }                         -> found, and it's yours
const findOwnIngredient = async (id, userId) => {
    const found = await findOwn("ingredients", id, userId, "Ingredient");
    return found.doc ? { ingredient: found.doc } : found;
};

module.exports = findOwnIngredient;
