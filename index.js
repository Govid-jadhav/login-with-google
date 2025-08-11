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
const dotenv = require("dotenv");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
dotenv.config();
const app = express();
const MONGO_URL = "mongodb://localhost:27017/login_page";

// const app = express();

// EJS setup
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
const User = require("./models/schema.js");


// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URL })
}));
// Serialize/deserialize user
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                photo: profile.photos[0].value
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

// GitHub OAuth strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            user = await User.create({
                githubId: profile.id,
                displayName: profile.displayName,
                email: profile.emails?.[0]?.value || "No public email",
                photo: profile.photos?.[0]?.value || ""
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.get("/", (req, res) => {
    res.render("login", { user: req.user }); // render views/home.ejs
});

// Google auth routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => res.redirect("/profile"));

// GitHub auth routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/" }), (req, res) => res.redirect("/profile"));

// Logout
app.get("/logout", (req, res) => {
    req.logout(() => res.redirect("/"));
});

// Middleware to protect profile route
function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/");
}

// Database connection

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}



app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});