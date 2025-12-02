/**
 * File: server.js
 * Desc: JS Express file for backend code.
 */

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// Helper function to get the full list of users.
function getUserList() {
    // Use FS to read the file and then add each user item to the list.
    const myUsers = fs.readFileSync("databases/users.json", "utf-8");
    
     // If it was empty bc there's no users yet make sure it just returns empty list.
     if (myUsers === "") {
        return [];
     }
    // Parse the data from the file for JSON and return the list.
    const myUserList = JSON.parse(myUsers);
    return myUserList;
}

// Helper function to update the users.json file.
function updateUserJSON(userList) {
    // Put userList back into JSON format.
    const userJSON = JSON.stringify(userList);
    // Use FS to write the list back into JSON format.
    fs.writeFileSync("databases/users.json", userJSON);
    return;
}


// When user first runs in their browser, send them to start.
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "start.html"));
});

// For when user has just submitted their new account details.
app.post("/signup", (req, res) => {
    // Need the list of all users to add to.
    const userList = getUserList();

    // Get the username and password for the account user just created.
    const myUsername = req.body.username;
    const myPassword = req.body.password;

    // ***TODO: Add the new user info to users.json.
    const myUserObj = {
        username: myUsername,
        password: myPassword
    }

    // Add the new userObj to the list of users.
    userList.push(myUserObj);

    // Update the JSON file.
    updateUserJSON(userList);

    // Now that info has been saved, send the user to the main catalog page.
    res.sendFile(path.join(__dirname, "catalog.html"));
});

// For when the user has just tried to login.
app.post("/login", (req, res) => {
    // Need the list of all users to help validate.
    // Get the username and password the user has entered.
    const myUsername = req.body.username;
    const myPassword = req.body.password;

    // ***TODO:
    // Verify that the username and password match one of the entries in users.json.

    // For every obj in users.json, if user.username === myUsername, check if myPassword === user.password.

    // If so, app.sendFile() to catalog.html like with /login.
});

