"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");



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


// Cathc all endpoint
App.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "You have reached a 404 error. This is not the page you are looking for.",
    });
});

App.listen(8000, () => console.log(`Listening on port 8000`));