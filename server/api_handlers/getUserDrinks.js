const { client } = require('../db');
const { ObjectId } = require('mongodb');


//TO MODIFY, I COPY PASTED THE GETONEDRINK FUNCTION


const getUserDrinks = async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId || !ObjectId.isValid(userId)) {
        return res.status(400).json({ status: 400, error: 'Invalid user ID' });
    }

    try {
        await client.connect();
        console.log('in');
        const db = client.db('tonic');

        // Find drinks where createdBy.id matches the given userId
        const drinks = await db
        .collection('drinks')
        .find({ 'createdBy.id': new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray();

        if (drinks.length === 0) {
        return res.status(404).json({ status: 404, message: 'No drinks found for this user' });
        }

        return res.status(200).json({ status: 200, drinks });
    } catch (err) {
        console.error('Error connecting to the database', err);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    } finally {
        await client.close();
        console.log('out');
    }
};


module.exports = getUserDrinks;