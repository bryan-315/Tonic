const { client } = require("../db")
const { ObjectId } = require('mongodb');



const createDrink = async (req, res) => {
    try{
        await client.connect();
        console.log('in')
        const db = client.db('tonic');

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
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ status: 400, error: 'Please add a name to the drink.' });
        }
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return res.status(400).json({ status: 400, error: 'Please add tags to the drink so that it can be more easily searched for.' });
        }
        tags.forEach(tag => {
            if (typeof tag !== 'string') {
                return res.status(400).json({ status: 400, error: 'Tag must be a string' });
            }
        })
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ status: 400, error: 'Invalid ingredients' });
        }
        ingredients.forEach(ingredient => {
            if (typeof ingredient !== 'string') {
                return res.status(400).json({ status: 400, error: 'Ingredient must be a string' });
            }
        })
        if (!instructions || !Array.isArray(instructions) || instructions.length === 0) {
            return res.status(400).json({ status: 400, error: 'Invalid instructions' });
        }
        instructions.forEach(instruction => {
            if (typeof instruction !== 'string') {
                return res.status(400).json({ status: 400, error: 'Instruction must be a string' });
            }
        })

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
    } finally {
        await client.close();
        console.log('out')
    }
}

module.exports = createDrink;