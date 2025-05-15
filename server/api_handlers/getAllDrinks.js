const { client } = require('../db');
const { ObjectId } = require('mongodb');

const getAllDrinks = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('tonic');
        const drinks = await db.collection('drinks').find({}).toArray();
        if (drinks.length === 0) {
            return res.status(404).json({ status: 404, message: 'No drinks found' });
        }
        return res.status(200).json({ status: 200, drinks });
    } catch (err) {
        console.error('Error connecting to the database', err);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    } finally {
        await client.close();
    }
}

module.exports = getAllDrinks;