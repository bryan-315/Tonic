// Shared database connection, opened once when the server starts (see db.js)
const { db } = require("../db")
const { ObjectId } = require('mongodb');



const createDrink = async (req, res) => {
    try{
        const { authorId, username, name,  tags, imageUrl, glassware, method, ingredients, instructions, description, isOfficial } = req.body;
        
        // Check all fields
        // Send a 400 status and an error if the fields are not valid

        // Mandatory fields
        if (!authorId || !ObjectId.isValid(authorId)) {
            return res.status(400).json({ status: 400, error: 'Invalid author ID' });
        }
        if (!username || typeof username !== 'string') {
            return res.status(400).json({ status: 400, error: 'Invalid author name' });
        }
        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ status: 400, error: 'Please add a name to the drink.' });
        }
        
        //validate tags
        if (!Array.isArray(tags) || tags.length === 0 || tags.some(tag => typeof tag !== 'string')) {
            return res.status(400).json({ status: 400, error: 'Invalid tags' });
        }

        //validate ingredients
        if (!Array.isArray(ingredients) || ingredients.length === 0 || ingredients.some(i => typeof i !== 'string')) {
                return res.status(400).json({ status: 400, error: 'Ingredients must be a non-empty array of strings' });
        }
        //validate instructions
        if (!Array.isArray(instructions) || instructions.length === 0 || instructions.some(i => typeof i !== 'string')) {
                return res.status(400).json({ status: 400, error: 'Instructions must be a non-empty array of strings' });
        }

        // Optional fields
        if (imageUrl && (typeof imageUrl !== 'string' || !imageUrl.startsWith('http'))) {
            return res.status(400).json({ status: 400, error: "Invalid image URL" });
        }
        if (glassware && typeof glassware !== 'string') {
            return res.status(400).json({ status: 400, error: "Glassware must be a string" });
        }
        if (method && typeof method !== 'string') {
            return res.status(400).json({ status: 400, error: "Method must be a string" });
        }

        const newDrink = {
            name: name.trim(),
            tags: tags,
            imageUrl: imageUrl,
            glassware: glassware,
            method: method,
            description: description,
            ingredients: ingredients,
            instructions: instructions,
            createdBy: {
                id: new ObjectId(authorId),
                name: username
            },
            createdAt: new Date(),
            likes: 0,
            dislikes: 0,
            isOfficial: Boolean(isOfficial)
        }
        // Insert the new ingredient into the database
        const result = await db.collection('drinks').insertOne(newDrink);
        console.log('Inserted ingredient with ID:', result.insertedId);
        return res.status(201).json({ status: 201, message: 'Drink posted successfully!', drink: { ...newDrink, _id: result.insertedId } });
    } catch (err) {
        console.error('Error connecting to the database', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = createDrink;