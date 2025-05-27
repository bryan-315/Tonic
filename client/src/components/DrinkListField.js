// components/DynamicListField.jsx
import React from 'react';

const DrinkListField = ({ label, values, onChange, placeholder }) => {
    return (
        <fieldset>
        <legend>{label}</legend>

        {/* Render one input row per value in the array */}
        {values.map((item, idx) => (
            <div
            key={idx}
            style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}
            >
            <input
                type="text"
                value={item}
                placeholder={placeholder}
                required={idx === 0}
                style={{ flex: 1 }}
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
                style={{ marginLeft: '0.5rem' }}
                >
                ×
                </button>
            )}
            </div>
        ))}

        {/* Button to add a new blank item */}
        <button
            type="button"
            onClick={() => onChange([...values, ''])}
        >
            + Add {label.replace(/\s.*$/, '')}
        </button>
        </fieldset>
    );
}

export default DrinkListField;
