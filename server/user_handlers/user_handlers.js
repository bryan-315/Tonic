// This file is for exporting handlers to the server.js file

const createUser = require("./createUser.js");
const logIn = require("./logIn.js");


module.exports = {
    createUser,
    logIn
}