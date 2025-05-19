const { client } = require('../db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const editDrink = async (req, res) => {
    try {
        await client.connect();
        console.log('in')
        const db = client.db('tonic');
        const drinks = db.collection('drinks');
        const { drinkId } = req.params;
        const { authorId, name, tags, imageUrl, glassware, method, ingredients, instructions, description } = req.body;
        // Mandatory fields
        if (!drinkId || !ObjectId.isValid(drinkId)) {
            return res.status(400).json({ status: 400, error: 'Invalid drink ID' });
        }
        if (!authorId || !ObjectId.isValid(authorId)) {
            return res.status(400).json({ status: 400, error: 'Invalid author ID' });
        }

        // Validate all the fields
        if (name && typeof name !== 'string') {
            return res.status(400).json({ status: 400, error: 'Invalid drink name' });
        }
        if (tags) {
            if (!Array.isArray(tags) || tags.length === 0 || tags.some(tag => typeof tag !== 'string')) {
                return res.status(400).json({ status: 400, error: 'Invalid tags' });
            }
        }
        if (imageUrl && (typeof imageUrl !== 'string' || !imageUrl.startsWith('http'))) {
            return res.status(400).json({ status: 400, error: "Invalid image URL" });
        }
        if (glassware && typeof glassware !== 'string') {
            return res.status(400).json({ status: 400, error: "Glassware must be a string" });
        }
        if (method && typeof method !== 'string') {
            return res.status(400).json({ status: 400, error: "Method must be a string" });
        }
        if (ingredients) {
            if (!Array.isArray(ingredients) || ingredients.length === 0 || ingredients.some(i => typeof i !== 'string')) {
                return res.status(400).json({ status: 400, error: 'Ingredients must be a non-empty array of strings' });
            }
        }
        if (instructions) {
            if (!Array.isArray(instructions) || instructions.length === 0 || instructions.some(i => typeof i !== 'string')) {
                return res.status(400).json({ status: 400, error: 'Instructions must be a non-empty array of strings' });
            }
        }
        if (description && typeof description !== 'string') {
            return res.status(400).json({ status: 400, error: 'Invalid description' });
        }

        // Create the update object
        const updatableFields = ['name', 'tags', 'imageUrl', 'glassware', 'method', 'ingredients', 'instructions', 'description'];
        const fieldsToUpdate = {};
        updatableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            // Trim string fields to remove empty spaces
            fieldsToUpdate[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
        }
        });
        // Check if the drink exists
        const drink = await drinks.findOne({ _id: new ObjectId(drinkId) });
        if (!drink) return res.status(404).json({ status: 404, error: "Drink not found" });

        // Check if the authorId of the request matches the authorId of the drink
        if (drink.createdBy.id.toString() !== authorId) {
        return res.status(403).json({ status: 403, error: "Not authorized to edit this drink" });
        }

        // Everything is valid, update the drink
        const result = await drinks.updateOne(
            { _id: new ObjectId(drinkId) },
            { $set: fieldsToUpdate }
        );

        // Check if there were any changes made
        const message = result.modifiedCount === 0
        ? "No changes were made (fields may have been identical)"
        : "Drink updated successfully";

        // Return the updated drink
        return res.status(200).json({
            status: 200,
            message,
            drink: {
                ...drink,
                ...fieldsToUpdate,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            error: 'Internal server error',
        });
    } finally {
        await client.close();
        console.log('out')
    }
}

module.exports = editDrink;