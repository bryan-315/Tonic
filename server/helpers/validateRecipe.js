// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db");
const { ObjectId } = require("mongodb");

// Checks and cleans a recipe sent by the browser. Two parts:
//   1. validateRecipe(body)               -> is the data the right SHAPE? (no database needed)
//   2. checkRecipeIngredients(lines, user) -> do the ingredients EXIST, are they YOURS,
//                                             and does each line use one of that ingredient's units?
// Used by both createRecipe and editRecipe, so the rules can't drift apart.
//
// Example of a valid body:
// {
//   name: "Chili",
//   lines: [{ ingredientId: "665f...", amount: 500, unit: "g" }],
//   description: "Brown the beef...\nAdd the beans...",   (optional)
//   imageUrl: "https://res.cloudinary.com/...",           (optional)
//   portions: { count: 6, name: "burrito" }               (optional)
// }

// Limits so nobody can save absurdly long text or huge lists
const MAX_NAME_LENGTH = 100;
const MAX_LINES = 100;
const MAX_UNIT_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_URL_LENGTH = 500;
const MIN_PORTIONS = 2;
const MAX_PORTIONS = 50;
const MAX_PORTION_NAME_LENGTH = 20;

// true for a real, finite number (rejects strings like "12", NaN and Infinity)
const isNumber = (x) => typeof x === "number" && Number.isFinite(x);

const validateRecipe = (body) => {
    // body could be anything (or nothing), so check it's an object first
    if (!body || typeof body !== "object") {
        return { error: "Missing recipe data." };
    }
    const { name, lines, description, imageUrl, portions } = body;

    // --- name: required text ---
    if (typeof name !== "string" || !name.trim()) {
        return { error: "Please give the recipe a name." };
    }
    const cleanName = name.trim();
    if (cleanName.length > MAX_NAME_LENGTH) {
        return { error: `Name must be ${MAX_NAME_LENGTH} characters or less.` };
    }

    // --- lines: 1 to 100 { ingredientId, amount, unit } ---
    if (!Array.isArray(lines) || lines.length === 0) {
        return { error: "Add at least one ingredient." };
    }
    if (lines.length > MAX_LINES) {
        return { error: `A recipe can have at most ${MAX_LINES} ingredients.` };
    }
    // findIndex (instead of .some) so the message can say WHICH line is wrong.
    // Lines are numbered from 1 for humans.
    const badLine = lines.findIndex((line) =>
        !line || typeof line !== "object" ||
        typeof line.ingredientId !== "string" || !ObjectId.isValid(line.ingredientId) ||
        !isNumber(line.amount) || line.amount <= 0 ||
        typeof line.unit !== "string" || !line.unit.trim() || line.unit.trim().length > MAX_UNIT_LENGTH
    );
    if (badLine !== -1) {
        return { error: `Ingredient line ${badLine + 1} needs an amount above 0 and a unit.` };
    }
    const cleanLines = lines.map((line) => ({
        ingredientId: new ObjectId(line.ingredientId),
        amount: line.amount,
        // Units are saved in lowercase on ingredients, so match that here
        unit: line.unit.trim().toLowerCase(),
    }));

    // --- description: optional free text (the "notebook page") ---
    // Not sent / null -> empty string. Line breaks inside are kept as they are.
    let cleanDescription = "";
    if (description !== undefined && description !== null) {
        if (typeof description !== "string") {
            return { error: "Description must be text." };
        }
        cleanDescription = description.trim();
        if (cleanDescription.length > MAX_DESCRIPTION_LENGTH) {
            return { error: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less.` };
        }
    }

    // --- imageUrl: optional link to the uploaded photo ---
    // Not sent / null / "" -> no photo. Otherwise it must be a normal https link.
    let cleanImageUrl = null;
    if (imageUrl !== undefined && imageUrl !== null && imageUrl !== "") {
        if (typeof imageUrl !== "string" || !imageUrl.startsWith("https://") || imageUrl.length > MAX_URL_LENGTH) {
            return { error: "Invalid photo link." };
        }
        cleanImageUrl = imageUrl;
    }

    // --- portions: optional { count, name } ---
    // Not sent / null -> the recipe is one whole thing (no portions).
    let cleanPortions = null;
    if (portions !== undefined && portions !== null) {
        if (typeof portions !== "object") {
            return { error: "Invalid portions." };
        }
        const { count, name: portionName } = portions;
        // Number.isInteger: whole numbers only ("6.5 burritos" makes no sense for a batch)
        if (!Number.isInteger(count) || count < MIN_PORTIONS || count > MAX_PORTIONS) {
            return { error: `Portions must be a whole number from ${MIN_PORTIONS} to ${MAX_PORTIONS}.` };
        }
        // The portion name is optional; blank means "portion"
        let cleanPortionName = "portion";
        if (portionName !== undefined && portionName !== null) {
            if (typeof portionName !== "string") {
                return { error: "Portion name must be text." };
            }
            if (portionName.trim()) cleanPortionName = portionName.trim();
            if (cleanPortionName.length > MAX_PORTION_NAME_LENGTH) {
                return { error: `Portion name must be ${MAX_PORTION_NAME_LENGTH} characters or less.` };
            }
        }
        cleanPortions = { count, name: cleanPortionName };
    }

    // Everything passed: only these fields get saved, anything extra in the body is ignored
    return {
        value: {
            name: cleanName,
            lines: cleanLines,
            description: cleanDescription,
            imageUrl: cleanImageUrl,
            portions: cleanPortions,
        },
    };
};

// Part 2: check the lines against the database.
// - every ingredient must exist and belong to this user
//   (otherwise you could put someone else's private ingredient in your recipe)
// - every line's unit must be one of that ingredient's units (otherwise the math is impossible)
//
// Returns { error } or { ingredients } (the ingredient documents, handy for the response).
const checkRecipeIngredients = async (cleanLines, userId) => {
    // The same ingredient can appear twice, so remove repeated IDs before asking the database
    const uniqueIds = [...new Set(cleanLines.map((line) => line.ingredientId.toString()))]
        .map((id) => new ObjectId(id));

    // One query for all of them. Filtering by ownerId means other users' ingredients
    // simply aren't found, so they're treated like ingredients that don't exist.
    const ingredients = await db
        .collection("ingredients")
        .find({ _id: { $in: uniqueIds }, ownerId: userId })
        .toArray();

    // A "map" from ID text to ingredient, for quick lookups below
    const byId = new Map(ingredients.map((ing) => [ing._id.toString(), ing]));

    for (let i = 0; i < cleanLines.length; i++) {
        const line = cleanLines[i];
        const ingredient = byId.get(line.ingredientId.toString());
        if (!ingredient) {
            return { error: `Ingredient line ${i + 1} uses an ingredient that wasn't found.` };
        }
        const hasUnit = ingredient.serving.some((row) => row.unit === line.unit);
        if (!hasUnit) {
            return { error: `${ingredient.name} doesn't have the unit "${line.unit}".` };
        }
    }

    return { ingredients };
};

// Case-insensitive comparison for duplicate-name checks ("chili" = "Chili")
const NAME_COLLATION = { locale: "en", strength: 2 };

module.exports = { validateRecipe, checkRecipeIngredients, NAME_COLLATION };
