const { client } = require("../db");
const { ObjectId } = require('mongodb');

const deleteDrink = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('tonic');
        const { drinkId } = req.params;
        const { authorId } = req.body;
        // Validate authorId
        if (!authorId || !ObjectId.isValid(authorId)) {
            return res.status(400).json({ status: 400, error: 'Invalid author ID' });
        }

        // Validate drinkId
        if (!ObjectId.isValid(drinkId)) {
            return res.status(400).json({ status: 400, error: 'Invalid drink ID' });
        }

        // Check if the drink exists
        const existingDrink = await db.collection('drinks').findOne({ _id: new ObjectId(drinkId) });
        if (!existingDrink) {
            return res.status(404).json({ status: 404, error: 'Drink not found' });
        }

        // Check if the authorId matches the drink's authorId
        if (existingDrink.createdBy.id.toString() !== authorId) {
            return res.status(403).json({ status: 403, error: 'You are not authorized to delete this drink' });
        }

        // Delete the drink
        await db.collection('drinks').deleteOne({ _id: new ObjectId(drinkId) });

        return res.status(200).json({ status: 200, message: 'Drink deleted successfully' });
    } catch (err) {
        console.error('Error connecting to the database', err);
        return res.status(500).json({ status: 500, error: 'Internal server error' });
    } finally {
        await client.close();
    }
}

module.exports = deleteDrink;