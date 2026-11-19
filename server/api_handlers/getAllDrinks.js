// Shared database connection, opened once when the server starts (see db.js)
const { db } = require('../db');
const { ObjectId } = require('mongodb');

const getAllDrinks = async (req, res) => {
    try {
        const drinks = await db.collection('drinks').find({}).toArray();
        return res.status(200).json({ status: 200, drinks });
    } catch (err) {
        console.error('Error connecting to the database', err);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    }
}

module.exports = getAllDrinks;
