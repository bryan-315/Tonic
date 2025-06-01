import styles from '../styles/DrinkListField.module.css';

const DrinkListField = ({ label, values, onChange, placeholder }) => {
    return (
        <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{label}</legend>

        {/* Render one input row per value in the array */}
        {values.map((item, idx) => (
            <div
            key={idx}
            className={styles.itemRow}
            >
            <input
                type="text"
                value={item}
                placeholder={placeholder}
                required={idx === 0}
                className={styles.input}
                onChange={e => {
                // Create a new array with the updated value at this index
                const newValues = [...values];
                newValues[idx] = e.target.value;
                onChange(newValues);
                }}
            />

            {/* Show a remove button if more than one item */}
            {values.length > 1 && (
                <button
                type="button"
                onClick={() => {
                    // Filter out the clicked index
                    const newValues = values.filter((_, i) => i !== idx);
                    onChange(newValues);
                }}
                className={styles.removeBtn}
                >
                ×
                </button>
            )}
            </div>
        ))}

        {/* Button to add a new blank item */}
        <button
        className={styles.addBtn}
            type="button"
            onClick={() => onChange([...values, ''])}
        >
            + Add {label.replace(/\s.*$/, '')}
        </button>
        </fieldset>
    );
}

export default DrinkListField;
