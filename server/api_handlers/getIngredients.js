// Shared database connection, opened once when the server starts (see db.js)
const { db } = require('../db');

const getIngredients = async (req, res) => {
    try {
        const ingredients = await db.collection('ingredients').find().toArray();
        res.status(200).json({
            status: 200,
            data: ingredients,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};

module.exports = getIngredients;
