// Automatic tests for the macro math.
// Run them from the client folder with:   yarn test
// (press "a" to run all, "q" to quit). Jest finds any file ending in .test.js.
//
// Each test() describes one thing that must be true; expect(...) checks it.
// If someone later breaks the math, these fail and say exactly which rule broke.

import {
    lineMacros,
    recipeTotals,
    perPortion,
    indexById,
    formatKcal,
    formatGrams,
    ZERO_MACROS,
} from './macros';

// Example ingredients, shaped like the ones the server sends
const whey = {
    _id: 'whey1',
    name: 'Whey',
    serving: [{ amount: 1, unit: 'scoop' }, { amount: 30, unit: 'g' }],
    calories: 120, protein: 24, carbs: 3, fat: null, // fat left blank
};
const oats = {
    _id: 'oats1',
    name: 'Oats',
    serving: [{ amount: 100, unit: 'g' }],
    calories: 389, protein: 13, carbs: 66, fat: 7,
};
const byId = indexById([whey, oats]);

describe('lineMacros', () => {
    test('2 scoops = 2 servings', () => {
        expect(lineMacros(whey, 2, 'scoop').calories).toBe(240);
        expect(lineMacros(whey, 2, 'scoop').protein).toBe(48);
    });

    test('45 g of a 30 g serving = 1.5 servings (the backlog example)', () => {
        expect(lineMacros(whey, 45, 'g').calories).toBe(180);
    });

    test('scoops and grams give the same answer for the same amount of food', () => {
        expect(lineMacros(whey, 1, 'scoop')).toEqual(lineMacros(whey, 30, 'g'));
    });

    test('a blank (null) macro counts as 0', () => {
        expect(lineMacros(whey, 1, 'scoop').fat).toBe(0);
    });

    test('0 amount = 0 everything', () => {
        expect(lineMacros(oats, 0, 'g')).toEqual(ZERO_MACROS);
    });

    test('returns null when it cannot calculate', () => {
        expect(lineMacros(whey, 1, 'cup')).toBeNull();      // unit the ingredient doesn't have
        expect(lineMacros(undefined, 1, 'g')).toBeNull();   // ingredient not found
        expect(lineMacros(whey, NaN, 'g')).toBeNull();      // amount not a number (still typing)
        expect(lineMacros(whey, -5, 'g')).toBeNull();       // negative amount
    });
});

describe('recipeTotals', () => {
    test('adds every line together', () => {
        const lines = [
            { ingredientId: 'whey1', amount: 1, unit: 'scoop' }, // 120 kcal, 24 p, 3 c, 0 f
            { ingredientId: 'oats1', amount: 50, unit: 'g' },    // 194.5 kcal, 6.5 p, 33 c, 3.5 f
        ];
        const { totals, skipped } = recipeTotals(lines, byId);
        expect(totals.calories).toBeCloseTo(314.5);
        expect(totals.protein).toBeCloseTo(30.5);
        expect(totals.carbs).toBeCloseTo(36);
        expect(totals.fat).toBeCloseTo(3.5);
        expect(skipped).toBe(0);
    });

    test('the same ingredient twice is counted twice', () => {
        const lines = [
            { ingredientId: 'whey1', amount: 1, unit: 'scoop' },
            { ingredientId: 'whey1', amount: 30, unit: 'g' },
        ];
        expect(recipeTotals(lines, byId).totals.calories).toBe(240);
    });

    test('lines that cannot be calculated are skipped and counted', () => {
        const lines = [
            { ingredientId: 'whey1', amount: 1, unit: 'scoop' },
            { ingredientId: 'whey1', amount: NaN, unit: 'g' },      // still typing
            { ingredientId: 'missing', amount: 1, unit: 'g' },      // unknown ingredient
        ];
        const { totals, skipped } = recipeTotals(lines, byId);
        expect(totals.calories).toBe(120);
        expect(skipped).toBe(2);
    });

    test('no lines = zero', () => {
        expect(recipeTotals([], byId)).toEqual({ totals: ZERO_MACROS, skipped: 0 });
    });
});

describe('perPortion', () => {
    test('divides by the portion count', () => {
        const totals = { calories: 1200, protein: 90, carbs: 60, fat: 30 };
        expect(perPortion(totals, 6)).toEqual({ calories: 200, protein: 15, carbs: 10, fat: 5 });
    });

    test('no valid portion count = null', () => {
        expect(perPortion(ZERO_MACROS, 0)).toBeNull();
        expect(perPortion(ZERO_MACROS, NaN)).toBeNull();
    });
});

describe('display rounding', () => {
    test('calories as whole numbers, grams with 1 decimal', () => {
        expect(formatKcal(412.4)).toBe('412 kcal');
        expect(formatKcal(412.6)).toBe('413 kcal');
        expect(formatGrams(31.46)).toBe('31.5 g');
        expect(formatGrams(30)).toBe('30 g');
    });
});
