import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/IngredientForm.module.css';

// Units suggested in the unit box. The user can still type anything (e.g. "slice of bread").
const UNIT_SUGGESTIONS = ['g', 'ml', 'scoop', 'piece', 'cup', 'tbsp', 'tsp', 'slice', 'oz', 'serving'];

// An empty form, used by the create page
export const blankIngredientForm = {
    name: '',
    serving: [{ amount: '', unit: '' }],
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
};

// Turn an ingredient from the server into form values.
// Inputs always hold TEXT, so numbers become strings and null (blank) becomes ''.
export const ingredientToForm = (ingredient) => ({
    name: ingredient.name,
    serving: ingredient.serving.map((row) => ({ amount: String(row.amount), unit: row.unit })),
    calories: String(ingredient.calories),
    protein: ingredient.protein === null ? '' : String(ingredient.protein),
    carbs: ingredient.carbs === null ? '' : String(ingredient.carbs),
    fat: ingredient.fat === null ? '' : String(ingredient.fat),
});

// Text from an input -> number. Accepts "1,5" too (phone keyboards in some languages use commas).
// Returns NaN for text that isn't a number ("abc", "12g").
const toNumber = (text) => Number(text.trim().replace(',', '.'));

// true if the text is a real number. Must be checked BEFORE sending:
// JSON can't hold NaN, so JSON.stringify quietly turns it into null,
// and the server would save "abc" as a blank instead of complaining.
const isNumberText = (text) => Number.isFinite(toNumber(text));

// The number boxes, with the names used in error messages
const MACRO_FIELDS = [
    ['calories', 'Calories'],
    ['protein', 'Protein'],
    ['carbs', 'Carbs'],
    ['fat', 'Fat'],
];

// Turn form values into what the server expects
const formToPayload = (form) => ({
    name: form.name,
    serving: form.serving
        // Skip rows the user left completely empty (e.g. pressed "+ add unit" by accident)
        .filter((row) => row.amount.trim() || row.unit.trim())
        .map((row) => ({ amount: toNumber(row.amount), unit: row.unit })),
    calories: form.calories.trim() === '' ? undefined : toNumber(form.calories),
    // Optional macros: empty box -> null ("not tracked")
    protein: form.protein.trim() === '' ? null : toNumber(form.protein),
    carbs: form.carbs.trim() === '' ? null : toNumber(form.carbs),
    fat: form.fat.trim() === '' ? null : toNumber(form.fat),
});

// The ingredient form. The page that uses it decides what "save" does (create or edit):
// onSubmit(payload) should throw an Error with a message if saving fails.
const IngredientForm = ({ initialData, onSubmit, submitLabel = 'Save' }) => {
    const [form, setForm] = useState(initialData);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    // If the page loads new data (edit page after its fetch), show it
    useEffect(() => {
        setForm(initialData);
    }, [initialData]);

    // For the simple text boxes (name, calories, protein, carbs, fat)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Change one box in one serving row, e.g. row 1's unit
    const handleServingChange = (index, field, value) => {
        setForm((prev) => ({
            ...prev,
            // Copy the array and replace only the row that changed (never edit state directly)
            serving: prev.serving.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
        }));
    };

    const addServingRow = () => {
        setForm((prev) => ({ ...prev, serving: [...prev.serving, { amount: '', unit: '' }] }));
    };

    const removeServingRow = (index) => {
        setForm((prev) => ({ ...prev, serving: prev.serving.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Quick checks so the user doesn't wait for the server for obvious mistakes.
        // The server still checks everything; these are just faster messages.
        if (!form.name.trim()) {
            setError('Please give the ingredient a name.');
            return;
        }
        if (!form.calories.trim()) {
            setError('Calories are required.');
            return;
        }
        // Every filled-in number box must hold a real number (blank optional boxes are fine)
        const badMacro = MACRO_FIELDS.find(([field]) => form[field].trim() && !isNumberText(form[field]));
        if (badMacro) {
            setError(`${badMacro[1]} must be a number, like 24 or 2.5.`);
            return;
        }
        const badAmount = form.serving.some((row) => row.amount.trim() && !isNumberText(row.amount));
        if (badAmount) {
            setError('Each serving amount must be a number, like 30 or 1.5.');
            return;
        }
        // setSaving goes after the checks, so the button never gets stuck on "Saving..."
        setSaving(true);
        try {
            await onSubmit(formToPayload(form));
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Name */}
            <label className={styles.field}>
                <span className={styles.label}>Name</span>
                <input
                    className={styles.input}
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Whey protein"
                    maxLength={100}
                    autoComplete="off"
                />
            </label>

            {/* Serving: one amount described in one or more units */}
            <fieldset className={styles.group}>
                <legend className={styles.legend}>Serving</legend>
                <p className={styles.hint}>
                    One serving, in as many units as you like. They all mean the same amount,
                    e.g. <strong>1 scoop</strong> = <strong>30 g</strong>.
                </p>

                {form.serving.map((row, index) => (
                    <div key={index} className={styles.servingRow}>
                        {/* "=" between rows shows they're the same amount */}
                        {index > 0 && <span className={styles.equals} aria-hidden="true">=</span>}
                        <input
                            className={`${styles.input} ${styles.amountInput}`}
                            type="text"
                            // inputMode="decimal" opens the number keyboard on phones.
                            // (type="number" has quirks, like scrolling changing the value.)
                            inputMode="decimal"
                            value={row.amount}
                            onChange={(e) => handleServingChange(index, 'amount', e.target.value)}
                            placeholder="1"
                            aria-label={`Amount ${index + 1}`}
                        />
                        <input
                            className={`${styles.input} ${styles.unitInput}`}
                            type="text"
                            // list= connects this box to the <datalist> of suggestions below
                            list="unit-suggestions"
                            value={row.unit}
                            onChange={(e) => handleServingChange(index, 'unit', e.target.value)}
                            placeholder={index === 0 ? 'scoop' : 'g'}
                            maxLength={20}
                            autoCapitalize="none"
                            aria-label={`Unit ${index + 1}`}
                        />
                        {/* You can't remove the last row: a serving needs at least one unit */}
                        {form.serving.length > 1 && (
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => removeServingRow(index)}
                                aria-label={`Remove unit ${index + 1}`}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}

                <datalist id="unit-suggestions">
                    {UNIT_SUGGESTIONS.map((unit) => <option key={unit} value={unit} />)}
                </datalist>

                {/* Max 10 units (same limit as the server) */}
                {form.serving.length < 10 && (
                    <button type="button" className={styles.addBtn} onClick={addServingRow}>
                        + Add unit
                    </button>
                )}
            </fieldset>

            {/* Macros for that serving */}
            <fieldset className={styles.group}>
                <legend className={styles.legend}>Per serving</legend>
                <div className={styles.macroGrid}>
                    <label className={styles.field}>
                        <span className={styles.label}>Calories <span className={styles.unit}>kcal</span></span>
                        <input className={styles.input} type="text" inputMode="decimal"
                            name="calories" value={form.calories} onChange={handleChange} placeholder="120" />
                    </label>
                    <label className={styles.field}>
                        <span className={styles.label}>Protein <span className={styles.unit}>g · optional</span></span>
                        <input className={styles.input} type="text" inputMode="decimal"
                            name="protein" value={form.protein} onChange={handleChange} />
                    </label>
                    <label className={styles.field}>
                        <span className={styles.label}>Carbs <span className={styles.unit}>g · optional</span></span>
                        <input className={styles.input} type="text" inputMode="decimal"
                            name="carbs" value={form.carbs} onChange={handleChange} />
                    </label>
                    <label className={styles.field}>
                        <span className={styles.label}>Fat <span className={styles.unit}>g · optional</span></span>
                        <input className={styles.input} type="text" inputMode="decimal"
                            name="fat" value={form.fat} onChange={handleChange} />
                    </label>
                </div>
            </fieldset>

            {/* role="alert" makes screen readers announce the error */}
            {error && <p className={styles.error} role="alert">{error}</p>}

            <div className={styles.actions}>
                <button type="submit" className={styles.submitBtn} disabled={saving}>
                    {saving ? 'Saving…' : submitLabel}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default IngredientForm;
