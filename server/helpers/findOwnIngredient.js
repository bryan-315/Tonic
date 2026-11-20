// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");
const { ObjectId } = require("mongodb");

// Get one ingredient by the ID in the URL, and make sure it belongs to the logged-in user.
// Used by get-one, edit and delete, which all need the same three checks.
//
// Returns one of:
//   { status: 400 | 403 | 404, message }  -> send this as the error response
//   { ingredient }                         -> found, and it's yours
const findOwnIngredient = async (id, userId) => {
    // IDs from the URL are strings; check they're valid before new ObjectId()
    if (!ObjectId.isValid(id)) {
        return { status: 400, message: "Invalid ingredient ID." };
    }

    const ingredient = await db.collection("ingredients").findOne({ _id: new ObjectId(id) });
    if (!ingredient) {
        return { status: 404, message: "Ingredient not found." };
    }

    // .equals() compares two ObjectIds properly (=== would compare the objects, not the IDs)
    if (!ingredient.ownerId.equals(userId)) {
        return { status: 403, message: "This ingredient isn't yours." };
    }

    return { ingredient };
};

module.exports = findOwnIngredient;
