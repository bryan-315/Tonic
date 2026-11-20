// Small helpers that turn ingredient data into readable text.
// Kept in one place so every page shows ingredients the same way.

// 1.5 -> "1.5", 30 -> "30", 0.3333333 -> "0.33" (max 2 decimals, no trailing zeros)
export const formatNumber = (n) => String(Math.round(n * 100) / 100);

// [{ amount: 1, unit: "scoop" }, { amount: 30, unit: "g" }] -> "1 scoop · 30 g"
export const servingText = (serving) =>
    serving.map((row) => `${formatNumber(row.amount)} ${row.unit}`).join(" · ");

// { calories: 120, protein: 24, carbs: null, fat: 2 } -> "120 kcal · 24 g protein · 2 g fat"
// Blank (null) macros are skipped instead of showing "0 g", since blank means "not tracked".
export const macrosText = (ingredient) => {
    const parts = [`${formatNumber(ingredient.calories)} kcal`];
    if (ingredient.protein !== null) parts.push(`${formatNumber(ingredient.protein)} g protein`);
    if (ingredient.carbs !== null) parts.push(`${formatNumber(ingredient.carbs)} g carbs`);
    if (ingredient.fat !== null) parts.push(`${formatNumber(ingredient.fat)} g fat`);
    return parts.join(" · ");
};
