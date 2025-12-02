/**
 * File: server.js
 * Desc: JS Express file for backend code.
 */

const express = require("express");
const app = express();
const path = require("path");

// When user first runs in their browser, send them to start.
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "start.html"))
});

// For when user has just submitted their new account details.
app.post("/signup", (req, res) => {
    // Get the username and password for the account user just created.
    const myUsername = req.body.username;
    const myPassword = req.body.password;

    // ***TODO: Add the new user info to users.json.

    // Now that info has been saved, send the user to the main catalog page.
    res.sendFile(path.join(__dirname, "catalog.html"));
});

// For when the user has just tried to login.
app.post("/login", (req, res) => {
    // Get the username and password the user has entered.
    const myUsername = req.body.username;
    const myPassword = req.body.password;

    // ***TODO:
    // Verify that the username and password match one of the entries in users.json.

    // For every obj in users.json, if user.username === myUsername, check if myPassword === user.password.

    // If so, app.sendFile() to catalog.html like with /login.
});

