const { client } = require("../db");
const { ObjectId } = require('mongodb');

const deleteDrink = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('tonic');
        const { drinkId } = req.params;

        // Validate drinkId
        if (!ObjectId.isValid(drinkId)) {
            return res.status(400).json({ error: 'Invalid drink ID' });
        }

        // Check if the drink exists
        const existingDrink = await db.collection('drinks').findOne({ _id: ObjectId(drinkId) });
        if (!existingDrink) {
            return res.status(404).json({ error: 'Drink not found' });
        }

        // Delete the drink
        await db.collection('drinks').deleteOne({ _id: ObjectId(drinkId) });

        return res.status(200).json({ status: 200, message: 'Drink deleted successfully' });
    } catch (err) {
        console.error('Error connecting to the database', err);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
}

module.exports = deleteDrink;