// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");
const { ObjectId } = require("mongodb");

// Get one document by the ID in the URL, and make sure it belongs to the logged-in user.
// Works for any collection whose documents have an `ownerId` (ingredients, recipes, diary...).
//
// Example: await findOwn("recipes", req.params.id, req.userId, "Recipe")
//
// Returns one of:
//   { status: 400 | 403 | 404, message }  -> send this as the error response
//   { doc }                                -> found, and it's yours
const findOwn = async (collectionName, id, userId, label) => {
    // IDs from the URL are strings; check they're valid before new ObjectId()
    if (!ObjectId.isValid(id)) {
        return { status: 400, message: `Invalid ${label.toLowerCase()} ID.` };
    }

    const doc = await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
    if (!doc) {
        return { status: 404, message: `${label} not found.` };
    }

    // .equals() compares two ObjectIds by value (=== would compare the objects themselves)
    if (!doc.ownerId.equals(userId)) {
        return { status: 403, message: `This ${label.toLowerCase()} isn't yours.` };
    }

    return { doc };
};

module.exports = findOwn;
