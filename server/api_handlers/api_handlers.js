// This file is used for exporting all the handlers to the server.js file.

const createIngredient = require("./createIngredient.js");
const getIngredients = require("./getIngredients.js");
const getOneIngredient = require("./getOneIngredient.js");
const createDrink = require("./createDrink.js");
const getAllDrinks = require("./getAllDrinks.js");


module.exports = {
    createIngredient,
    getIngredients,
    getOneIngredient,

    createDrink,
    getAllDrinks
};

