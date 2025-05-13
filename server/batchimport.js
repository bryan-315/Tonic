
const { ObjectId } = require('mongodb');
const { client } = require('./db');

const drinksArr = [
    {
        name: "Espresso Martini",
        imageUrl: "https://res.cloudinary.com/djijwros2/image/upload/v1747105359/espressoMartini_yqxwp3.png",
        glassware: "Coupe",
        method: "Shaken, Double-Strained",
        ingredients: [
        { ingredientId: ObjectId("68216bbb440ad02fb90018bf"), amount: 1, unit: "oz" }, // Lime juice
        { ingredientId: ObjectId("68216bbb440ad02fb90018be"), amount: 0.75, unit: "oz" }, // Simple syrup
        { ingredientId: ObjectId("68216bbb440ad02fb90018c3"), amount: 1.25, unit: "oz" },
        { ingredientId: ObjectId("68216bbb440ad02fb90018de"), amount: 0.25, unit: "oz"},
        { ingredientId: ObjectId("6822baa4e15e93939e3244fa")}
        ],
        instructions: [
            "Add the vodka, coffee liqueur, espresso and orgreat in a shaker.",
            "Shake with ice for around 10 seconds.",
            "Double Strain the mixture into a chilled coupe glass",
            "Optional: Garnish with coffee beans"
        ],
        createdBy: null, // Will be set once auth is up
        createdAt: new Date()
    },
    {
        name: "Whiskey Sour",
        imageUrl: "https://res.cloudinary.com/djijwros2/image/upload/v1747107023/whiskeySour_kx9zsj.png",
        glassware: "Rocks Glass",
        method: "Reverse-Dry Shaken",
        ingredients: [
        { ingredientId: ObjectId("68216bbb440ad02fb90018c4"), amount: 1.5, unit: "oz" }, // Lime juice
        { ingredientId: ObjectId("68216bbb440ad02fb90018b0"), amount: 0.75, unit: "oz" }, // Simple syrup
        { ingredientId: ObjectId("68216bbb440ad02fb90018b1"), amount: 0.75, unit: "oz" },
        { ingredientId: ObjectId("68216bbb440ad02fb90018f2"), amount: 0.5, unit: "oz"},
        { ingredientId: ObjectId("6822baa4e15e93939e3244fa")}
        ],
        instructions: [
            "Add the bouron, syrup and lemon juice to a shaker",
            "Shake with ice for around 10 seconds.",
            "Strain the mixture",
            "Dry shake (no ice) the strained mixture for another 10 seconds to develop a good foam",
            "Pour the shaken mixture into a rocks glass with ice",
            "Optional: Garnish with a cherry and lemon twist."
        ],
        createdBy: null, // Will be set once auth is up
        createdAt: new Date()
    },
]


const dbImport = async () => {
    try {
        await client.connect();
        console.log('in');
        const db = client.db('tonic');
        const result = await db.collection('ingredients').find({ category: 'Liqueur' }).toArray();
        console.log(result)
    } catch(err) {
        console.log('error');
        console.log(err.stack);
    } finally {
        await client.close();
        console.log('out')
    }
}

dbImport();