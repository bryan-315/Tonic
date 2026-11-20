const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

// ONE client for the whole server.
// Think of it as one phone line to the database that stays open while the server runs.
// Inside, the MongoDB driver keeps a small "pool" of connections and hands them out
// to requests automatically, so many requests can use it at the same time.
const client = new MongoClient(MONGO_URI);

// The database every handler uses.
// client.db() doesn't talk to the database yet, it just says "when you do, use 'tonic'".
const db = client.db("tonic");

// Called ONCE from server.js, before the server starts accepting requests.
// Handlers must NOT call client.connect() or client.close() themselves:
// closing the shared client in one handler would cut off every other request using it.
const connectToDb = async () => {
    await client.connect();
    // connect() can succeed lazily, so ping to be sure the database really answers
    await db.command({ ping: 1 });
    console.log("Connected to MongoDB");
};

// Called when the server shuts down (Ctrl+C), to hang up politely.
const closeDb = async () => {
    await client.close();
    console.log("MongoDB connection closed");
};

module.exports = { db, connectToDb, closeDb };
