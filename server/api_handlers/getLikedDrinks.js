const { client } = require('../db');
const { ObjectId } = require('mongodb');

const getLikedDrinks = async (req, res) => {
    const { userId } = req.params; 

    // Validate userId
    if (!userId || !ObjectId.isValid(userId)) {
        return res.status(400).json({ status: 400, error: 'Invalid user ID' });
    }

    try {
        await client.connect();
        const db = client.db('tonic');
        const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(userId) });

        if (!user) {
        return res
            .status(404)
            .json({ status: 404, message: 'User not found' });
        }

        // Check if the user has liked drinks
        if (!user.likedDrinks || user.likedDrinks.length === 0) {
        return res
            .status(200)
            .json({ status: 200, message: 'No liked drinks found', drinks: [] });
        }

        //fetch the liked drinks
        const drinks = await db
        .collection('drinks')
        .find({ _id: { $in: user.likedDrinks } })
        .toArray();

        return res.status(200).json({ status: 200, drinks });
    } catch (err) {
        console.error('Error fetching liked drinks', err);
        return res
        .status(500)
        .json({ status: 500, error: 'Internal server error' });
    } finally {
        await client.close();
    }
};

module.exports = getLikedDrinks;