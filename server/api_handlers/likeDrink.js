const { client } = require('../db');
const { ObjectId } = require('mongodb');


const likeDrink = async (req, res) => {
    const { authorId } = req.body;
    const { drinkId } = req.params;
    // Validate the Ids
    if (!authorId || !drinkId) {
        return res.status(400).json({ status: 400, error: "User ID and drink ID are required" });
    }
    if (!ObjectId.isValid(authorId) || !ObjectId.isValid(drinkId)) {
    return res.status(400).json({ status: 400, error: "Invalid user ID or drink ID" });
    }
    try {
        await client.connect();
        console.log('in');
        const db = client.db("tonic");
        const users = db.collection("users");
        const drinks = db.collection("drinks");
        
        const user = await users.findOne({ _id: new ObjectId(authorId) });
        const drink = await drinks.findOne({ _id: new ObjectId(drinkId) });

        // Check if the user and drink exist
        if (!user || !drink) {
            return res.status(404).json({ status: 404, error: "User or drink not found" });
        }
    
        // Check if the user already liked the drink
        const alreadyLiked = user.likedDrinks?.some(id => id.toString() === drinkId);
        if (alreadyLiked) {
            return res.status(400).json({ status: 400, error: "You already liked this drink" });
        }
    
        // Add drink to user's liked drinks
        await users.updateOne(
            { _id: new ObjectId(authorId) },
            { $push: { likedDrinks: new ObjectId(drinkId) } }
        );
    
        // Add a like to the drink
        await drinks.updateOne(
            { _id: new ObjectId(drinkId) },
            { $inc: { likes: 1 } }
        );
    
        return res.status(200).json({ status: 200, message: "Drink liked!" });

    } catch (err) {
        console.error("Like error:", err);
        return res.status(500).json({ status: 500, error: "Server error while liking drink" });
    } finally {
        await client.close();
        console.log('out');
    }
};

module.exports = likeDrink;