"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// import the handlers

// Api
const { 
    createIngredient,
    getIngredients,
    getOneIngredient,
    getAllDrinks,
    getOneDrink,
    getUserDrinks,
    getLikedDrinks,
    createDrink,
    editDrink,
    likeDrink,
    unlikeDrink,
    deleteDrink

} = require("./api_handlers/api_handlers.js");

// Other handlers

const {
    createUser,
    logIn,
} = require("./user_handlers/user_handlers.js");

const App = express();

// Middleware
// CORS middleware to allow cross-origin requests
App.use(cors({
    origin: "http://localhost:3000"
    // Credentials for cookies (to implement later) credentials: true
}));

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
App.get("/api/user/:userId/liked", getLikedDrinks);
App.get("/api/user/:userId/drinks", getUserDrinks);

App.patch("/api/drinks/:drinkId", editDrink);
App.patch("/api/drinks/:drinkId/like", likeDrink);
App.patch("/api/drinks/:drinkId/unlike", unlikeDrink);

App.delete("/api/drinks/:drinkId", deleteDrink);

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