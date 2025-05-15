const { client } = require("../db")
const { ObjectId } = require('mongodb');



const createIngredient = async (req, res) => {
    try{
        await client.connect();
        console.log('in')
        const db = client.db('tonic');
        const { name, category, alcohol, tags, unit } = req.body;
        // Check mandatory fields
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Invalid name' });
        }
        // Normalize the casing of the name
        const normalizedName = name.trim().replace(/\b\w/g, char => char.toUpperCase());
        if (normalizedName.length < 2) {
            return res.status(400).json({ error: 'Name must be at least 2 characters long' });
        }
        if (!category || typeof category !== 'string') {
            return res.status(400).json({ error: 'Invalid category' });
        }
        if (alcohol === undefined || typeof alcohol !== 'boolean') {
            return res.status(400).json({ error: 'Invalid alcohol' });
        }

        // Check if the ingredient already exists
        const existingIngredient = await db.collection('ingredients').findOne({ 
            name: { $regex: `^${normalizedName}$`, $options: 'i' }, // Case-insensitive match
        });
        if (existingIngredient) {
            return res.status(409).json({ error: 'Ingredient already exists' });
        }

        // Create the new ingredient object
        const newIngredient = {
            name: normalizedName,
            category,
            alcohol
        };
        // Optional fields
        if (tags && Array.isArray(tags)) {
            newIngredient.tags = tags;
        }
        if (unit && typeof unit === 'string') {
            newIngredient.unit = unit;
        }
        // Insert the new ingredient into the database
        const result = await db.collection('ingredients').insertOne(newIngredient);
        console.log('Inserted ingredient with ID:', result.insertedId);
        return res.status(201).json({ status: 201, message: 'Ingredient created successfully', ingredient: { ...newIngredient, _id: result.insertedId } });
    } catch (err) {
        console.error('Error connecting to the database', err);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
        console.log('out')
    }
}

module.exports = createIngredient;