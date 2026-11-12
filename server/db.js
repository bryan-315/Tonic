
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;


const client = new MongoClient(MONGO_URI)

module.exports = { client }