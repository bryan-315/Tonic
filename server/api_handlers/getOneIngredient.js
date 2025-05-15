const { client } = require('../db');
const { ObjectId } = require('mongodb');

const getOneIngredient = async (req, res) => {
    try {
        const db = client.db('tonic');
        await client.connect();
        const { id } = req.params;
        // Check if the ID is valid
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid ingredient ID",
            });
        }
        const ingredientId = new ObjectId(id);
        const ingredient = await db.collection('ingredients').findOne({ _id: ingredientId });

        if (!ingredient) {
            return res.status(404).json({
                status: 404,
                message: "Ingredient not found",
            });
        }

        res.status(200).json({
            status: 200,
            data: ingredient,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    } finally {
        await client.close();
    }
}

module.exports = getOneIngredient;