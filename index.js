const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const engine = require("ejs-mate");
const LocalStrategy = require("passport-local");

const MONGO_URL = "mongodb://127.0.0.1:27017/room";

const app = express();

// EJS setup
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.get("/", (req, res) => {
    res.render("login"); // render views/home.ejs
});

// Database connection
mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Mongo Error:", err));

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
