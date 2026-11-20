// Checks and cleans an ingredient sent by the browser.
// Used by BOTH createIngredient and editIngredient, so the rules can't drift apart.
//
// Returns one of:
//   { error: "message for the user" }   -> something is wrong, answer 400
//   { value: { ...cleaned ingredient } } -> safe to save
//
// Example of a valid body:
// {
//   name: "Whey",
//   serving: [{ amount: 1, unit: "scoop" }, { amount: 30, unit: "g" }],
//   calories: 120, protein: 24, carbs: 3, fat: null
// }

// Limits so nobody can save absurdly long text or huge lists.
// (Numbers have no upper limit: a big number is odd but still a number.)
const MAX_NAME_LENGTH = 100;
const MAX_UNIT_LENGTH = 20;
const MAX_UNITS = 10;

// true for a real, finite number (rejects strings like "12", NaN and Infinity)
const isNumber = (x) => typeof x === "number" && Number.isFinite(x);

// Optional macros (protein, carbs, fat):
// - not sent, or null  -> saved as null ("left blank"; counts as 0 in totals later)
// - a number >= 0     -> saved as is
// - anything else     -> error
const cleanOptionalMacro = (value, label) => {
    if (value === undefined || value === null) return { value: null };
    if (!isNumber(value) || value < 0) {
        return { error: `${label} must be a number of 0 or more, or left blank.` };
    }
    return { value };
};

const validateIngredient = (body) => {
    // body could be anything (or nothing), so check it's an object first
    if (!body || typeof body !== "object") {
        return { error: "Missing ingredient data." };
    }
    const { name, serving, calories, protein, carbs, fat } = body;

    // --- name: required text ---
    // Type check BEFORE .trim(), otherwise a number or undefined would crash
    if (typeof name !== "string" || !name.trim()) {
        return { error: "Please give the ingredient a name." };
    }
    const cleanName = name.trim();
    if (cleanName.length > MAX_NAME_LENGTH) {
        return { error: `Name must be ${MAX_NAME_LENGTH} characters or less.` };
    }

    // --- serving: 1 to 10 { amount, unit } rows that all mean the same amount of food ---
    if (!Array.isArray(serving) || serving.length === 0) {
        return { error: "Add at least one serving size, e.g. 100 g." };
    }
    if (serving.length > MAX_UNITS) {
        return { error: `An ingredient can have at most ${MAX_UNITS} units.` };
    }
    // .some() in a normal if: stops at the first bad row (never `return` inside .forEach)
    const badRow = serving.some((row) =>
        !row || typeof row !== "object" ||
        !isNumber(row.amount) || row.amount <= 0 ||
        typeof row.unit !== "string" || !row.unit.trim() || row.unit.trim().length > MAX_UNIT_LENGTH
    );
    if (badRow) {
        return { error: "Each serving size needs an amount above 0 and a unit (e.g. 30 g)." };
    }
    // Units are saved in lowercase so "G" and "g" count as the same unit
    const cleanServing = serving.map((row) => ({
        amount: row.amount,
        unit: row.unit.trim().toLowerCase(),
    }));
    // No repeated units: "1 scoop = 30 g = 40 g" makes no sense
    const units = cleanServing.map((row) => row.unit);
    if (new Set(units).size !== units.length) {
        return { error: "Each unit can only be used once per ingredient." };
    }

    // --- calories: the only required macro ---
    if (!isNumber(calories) || calories < 0) {
        return { error: "Calories must be a number of 0 or more." };
    }

    // --- protein, carbs, fat: optional ---
    const cleanProtein = cleanOptionalMacro(protein, "Protein");
    if (cleanProtein.error) return cleanProtein;
    const cleanCarbs = cleanOptionalMacro(carbs, "Carbs");
    if (cleanCarbs.error) return cleanCarbs;
    const cleanFat = cleanOptionalMacro(fat, "Fat");
    if (cleanFat.error) return cleanFat;

    // Everything passed: only these fields get saved, anything extra in the body is ignored
    return {
        value: {
            name: cleanName,
            serving: cleanServing,
            calories,
            protein: cleanProtein.value,
            carbs: cleanCarbs.value,
            fat: cleanFat.value,
        },
    };
};

// Case-insensitive comparison for duplicate-name checks ("whey" = "Whey" = "WHEY").
// strength 2 = ignore upper/lowercase but not accents.
const NAME_COLLATION = { locale: "en", strength: 2 };

module.exports = { validateIngredient, NAME_COLLATION };
