const { client } = require('../db');
const { ObjectId } = require('mongodb');



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

        //find the user first so we can send their name, even if there are no recipes.
        const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(userId) });

        if (!user) {
        return res
            .status(404)
            .json({ status: 404, message: 'User not found' });
        }

        // Find drinks where createdBy.id matches the given userId
        const drinks = await db
        .collection('drinks')
        .find({ 'createdBy.id': new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray();


        return res.status(200).json({ status: 200, drinks, username: user.username });
    } catch (err) {
        console.error('Error connecting to the database', err);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    } finally {
        await client.close();
        console.log('out');
    }
};


module.exports = getUserDrinks;