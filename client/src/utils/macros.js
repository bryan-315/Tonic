// THE macro math for Tonic. Every calorie/protein number in the app comes from here,
// so it's kept small, plain and covered by tests (macros.test.js).
//
// The idea (see BACKLOG.md, "How the math works"):
// an ingredient stores ONE serving, described in one or more units, plus the macros for it:
//     Whey: 1 scoop = 30 g  ->  120 kcal, 24 g protein
// To get the macros for any amount, scale by how many servings that amount is:
//     macros used = macros × (amount used ÷ serving amount in that unit)
//     45 g whey   = 120 × (45 ÷ 30) = 180 kcal

// A "macros" object always has all four keys, with plain numbers
export const ZERO_MACROS = { calories: 0, protein: 0, carbs: 0, fat: 0 };

// The serving row for a unit, e.g. ("g") -> { amount: 30, unit: "g" }. undefined if the unit doesn't exist.
export const findServingRow = (ingredient, unit) =>
    ingredient.serving.find((row) => row.unit === unit);

// Macros for one line: "this amount of this ingredient, in this unit".
// Returns null when it can't be calculated (no ingredient, unknown unit, or an amount
// that isn't a number yet, e.g. while the user is still typing). The caller decides what to show.
export const lineMacros = (ingredient, amount, unit) => {
    if (!ingredient) return null;
    const row = findServingRow(ingredient, unit);
    if (!row) return null;
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) return null;

    // How many servings is this amount? e.g. 45 g of a 30 g serving = 1.5 servings
    const servings = amount / row.amount;

    return {
        calories: ingredient.calories * servings,
        // `?? 0`: a blank (null) macro counts as 0 in totals
        protein: (ingredient.protein ?? 0) * servings,
        carbs: (ingredient.carbs ?? 0) * servings,
        fat: (ingredient.fat ?? 0) * servings,
    };
};

// Add two macros objects together
export const addMacros = (a, b) => ({
    calories: a.calories + b.calories,
    protein: a.protein + b.protein,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
});

// Totals for a whole recipe.
// - lines: [{ ingredientId, amount, unit }]
// - ingredientsById: { "<ingredient id>": ingredient, ... }
// Returns { totals, skipped }: `skipped` counts lines that couldn't be calculated
// (e.g. an amount still being typed), so the page can say the total isn't complete.
export const recipeTotals = (lines, ingredientsById) => {
    let totals = ZERO_MACROS;
    let skipped = 0;
    for (const line of lines) {
        const macros = lineMacros(ingredientsById[line.ingredientId], line.amount, line.unit);
        if (macros) totals = addMacros(totals, macros);
        else skipped++;
    }
    return { totals, skipped };
};

// Macros for one portion: totals ÷ number of portions.
// Returns null if there's no valid portion count (the recipe is one whole thing).
export const perPortion = (totals, count) => {
    if (!Number.isFinite(count) || count < 1) return null;
    return {
        calories: totals.calories / count,
        protein: totals.protein / count,
        carbs: totals.carbs / count,
        fat: totals.fat / count,
    };
};

// Turn a list of ingredients into { id: ingredient } for quick lookups.
// (Recipes store ingredient IDs; this lets us find each ingredient instantly.)
export const indexById = (ingredients) =>
    Object.fromEntries(ingredients.map((ingredient) => [ingredient._id, ingredient]));

// Display rounding (only for showing numbers; never round before adding things up,
// or small errors would pile up)
export const formatKcal = (n) => `${Math.round(n)} kcal`;              // 412.4 -> "412 kcal"
export const formatGrams = (n) => `${Math.round(n * 10) / 10} g`;      // 31.46 -> "31.5 g"
