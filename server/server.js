"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");

// import the handlers

// Api
const { 
    createIngredient,
    getIngredients,
    getOneIngredient,
    getAllDrinks,
    getOneDrink,
    createDrink,
    editDrink,
    likeDrink,
    unlikeDrink

} = require("./api_handlers/api_handlers.js");

// Other handlers

const {
    createUser,
    logIn,
} = require("./user_handlers/user_handlers.js");

const App = express();

//Log info to the console
App.use(morgan("tiny"));
App.use(express.json());
// Any requests for static files will go into the public folder
App.use(express.static("public"));


App.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        message: "Welcome to the Tonic API",
    });
});

// API endpoints
App.post("/api/ingredients", createIngredient);

App.get("/api/ingredients", getIngredients);
App.get("/api/ingredients/:id", getOneIngredient);

App.post("/api/drinks", createDrink);
App.get("/api/drinks", getAllDrinks);
App.get("/api/drinks/:drinkId", getOneDrink);

App.patch("/api/drinks/:drinkId", editDrink);
App.patch("/api/drinks/:drinkId/like", likeDrink);
App.delete;("/api/drinks/:drinkId/unlike", unlikeDrink);

// Users endpoints
App.post("/user/signup", createUser);
App.post("/user/login", logIn);

// Catch all endpoint
App.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "You have reached a 404 error. This is not the page you are looking for.",
    });
});

App.listen(8000, () => console.log(`Listening on port 8000`));