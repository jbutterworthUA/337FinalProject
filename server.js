/**
 * File: server.js
 * Desc: JS Express file for backend code.
 */

const express = require("express");
const app = express();
const path = require("path");

// When user first runs in their browser, send them to start.
app.get("/", (req, res) => {
    res.send()
});