// This file is used for exporting all the api handlers to the server.js file.

const createIngredient = require("./createIngredient.js");
const getIngredients = require("./getIngredients.js");
const getOneIngredient = require("./getOneIngredient.js");
const editIngredient = require("./editIngredient.js");
const deleteIngredient = require("./deleteIngredient.js");
const createRecipe = require("./createRecipe.js");
const getRecipes = require("./getRecipes.js");
const getOneRecipe = require("./getOneRecipe.js");
const editRecipe = require("./editRecipe.js");
const deleteRecipe = require("./deleteRecipe.js");
const createDrink = require("./createDrink.js");
const getAllDrinks = require("./getAllDrinks.js");
const getOneDrink = require("./getOneDrink.js");
const editDrink = require("./editDrink.js");
const likeDrink = require("./likeDrink.js");
const unlikeDrink = require("./unlikeDrink.js");
const deleteDrink = require("./deleteDrink.js");
const getUserDrinks = require("./getUserDrinks.js");
const getLikedDrinks = require("./getLikedDrinks.js");



module.exports = { 
    createIngredient,
    getIngredients,
    getOneIngredient,
    editIngredient,
    deleteIngredient,
    createRecipe,
    getRecipes,
    getOneRecipe,
    editRecipe,
    deleteRecipe,
    getOneDrink,
    createDrink,
    getAllDrinks,
    getUserDrinks,
    getLikedDrinks,
    editDrink,
    likeDrink,
    unlikeDrink,
    deleteDrink
};

