const { client } = require('../db');
const { ObjectId } = require('mongodb');


const getOneDrink = async (req, res) => {
    try {
        await client.connect();
        console.log('in');
        const db = client.db('tonic');
        const { drinkId } = req.params;

        // Check if the drinkId is a valid ObjectId
        if (!ObjectId.isValid(drinkId)) {
            return res.status(400).json({ status: 400, error: 'Invalid drink ID' });
        }

        const drink = await db.collection('drinks').findOne({ _id: new ObjectId(drinkId) });

        if (!drink) {
            return res.status(404).json({ status: 404, message: 'Drink not found' });
        }

        return res.status(200).json({ status: 200, drink });
    } catch (err) {
        console.error('Error connecting to the database', err);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    } finally {
        await client.close();
        console.log('out');
    }
}

module.exports = getOneDrink;