/**
 * File: server.js
 * Desc: JS Express file for backend code.
 */

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// Needing these so we can do req.query, etc post stuff with express.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Need this to be able to serve the database files since they're in a different folder.
app.use(express.static(__dirname));

// Helper function to get the full list of users.
function getUserList() {
    // Use FS to read the file and then add each user item to the list.
    const myUsers = fs.readFileSync(path.join(__dirname, "databases/users.json"), "utf-8");
    
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
    return res.sendFile(path.join(__dirname, "start.html"));
});

// For when user has just submitted their new account details.
app.post("/signup", (req, res) => {
    // Need the list of all users to add to.
    const userList = getUserList();

    // Get the username and password for the account user just created.
    const newUsername = req.body.username;
    const newPassword = req.body.password;

    // ***TODO: If the username already exists, then they need to do it again.
    // Rn this will just send back to the signup page without saying why.
    for (let user of userList) {
        const currName = user.username;
        if (currName === newUsername) {
            return res.redirect(`/signup?error=iv`);
        }
    }

    // Add the new user info to users.json.
    const myUserObj = {
        username: newUsername,
        password: newPassword
    }

    // Add the new userObj to the list of users.
    userList.push(myUserObj);

    // Update the JSON file.
    updateUserJSON(userList);

    // IMPORTANT: Now that the user has signed up, they will get their own .json file
    // so we can keep track of how which movies they have flagged for their watchlist.
    // Will be a copy of the "master" catalog.json, and we will only flag the movie in their personal json file when they bookmark one.
    const masterCatalog = fs.readFileSync("databases/catalog.json", "utf-8");


    fs.writeFileSync(`databases/user_catalogs/${newUsername}_catalog.json`, masterCatalog);

    // Now that info has been saved, send the user to the main catalog page.
    // Going to make it so that localStorage keeps track of current user.
    return res.send(`
        <script>
            localStorage.setItem("currentUser", "${newUsername}");
            window.location.href = "/catalog";
        </script>
    `);
});

// Signup needs a GET bc the redirect with error msg will do a GET request.
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});

// For when the user has just tried to login.
app.post("/login", (req, res) => {
    // Need the list of all users to help validate.
    const userList = getUserList();

    // Get the username and password the user has entered.
    const myUsername = req.body.username;
    const myPassword = req.body.password;

    // Verify that the username and password match one of the entries in users.json.
    // Loop over all existing users.
    for (let user of userList) {
        const currName = user.username;
        const currPwd = user.password;
        // If username and password match an entry, send user to the main catalog page.
        if (currName === myUsername && currPwd === myPassword) {
            // Going to make it so that localStorage keeps track of current user.
            return res.send(`
                <script>
                    localStorage.setItem("currentUser", "${myUsername}");
                    window.location.href = "/catalog";
                </script>
            `);
        }
    }
    // At this point the user entered invalid credentials. Need to go back to the login page.
    // Need to tell them they entered something invalid. iv for invalid.
    return res.redirect(`/login?error=iv`);
});

// Add movie to watchlist (flag = true)
app.post("/addToWatchlist", (req, res) => {
    const { user, title } = req.body;
    const filePath = `databases/user_catalogs/${user}_catalog.json`;

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read file" });

        let catalog = JSON.parse(data);

        for (let movie of catalog) {
            if (movie.title === title) {
                movie.flagged = true;
            }
        }

        fs.writeFile(filePath, JSON.stringify(catalog, null, 2), err => {
            if (err) return res.status(500).json({ error: "Failed to save file" });

            res.json({ message: `${title} added to watchlist.` });
        });
    });
});

// Remove movie from watchlist and record rating
app.post("/removeFromWatchlist", (req, res) => {
    const { user, title, rating } = req.body;
    const filePath = `databases/user_catalogs/${user}_catalog.json`;

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Failed to read file:", err);
            return res.status(500).json({ error: "Failed to read file" });
        }

        let catalog = JSON.parse(data);
        let found = false;

        for (let movie of catalog) {
            if (movie.title === title) {
                movie.flagged = true;
                movie.rating = rating;
                found = true;
                break;
            }
        }

        if (!found) {
            console.error(`${title} not found in catalog.`);
            return res.status(404).json({ error: "Movie not found" });
        }

        fs.writeFile(filePath, JSON.stringify(catalog, null, 2), err => {
            if (err) {
                console.error("Failed to save file:", err);
                return res.status(500).json({ error: "Failed to save file" });
            }

            res.json({ message: `${title} removed from watchlist and rated ${rating}.` });
        });
    });
});



// Login needs a GET bc the redirect with error msg will do a GET request.
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});


app.get("/catalog", (req, res) => {
    return res.sendFile(path.join(__dirname, "catalog.html"));
});

app.get("/watchlist", (req, res) => {
    return res.sendFile(path.join(__dirname, "watchlist.html"));
});

app.listen(3000, () => {console.log("Server running on http://localhost:3000")});
