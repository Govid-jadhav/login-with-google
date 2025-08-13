const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const engine = require("ejs-mate");
const dotenv = require("dotenv");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: GitHubStrategy } = require("passport-github2");
const User = require("./models/schema");

dotenv.config();
const app = express();

// --- Database ---
const MONGO_URL = "mongodb://localhost:27017/login_page";
mongoose.connect(MONGO_URL)
    .then(() => console.log("Connected to DB"))
    .catch(err => console.error(err));

// --- EJS Setup ---
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(flash());

// --- Session ---
app.use(session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URL })
}));

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// --- Google OAuth ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails?.[0]?.value || null,
                photo: profile.photos?.[0]?.value || null
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// --- GitHub OAuth ---
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
                username: profile.displayName || profile.username,
                email: profile.emails?.[0]?.value || "No public email",
                photo: profile.photos?.[0]?.value || ""
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

// --- Auth Middleware ---
function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/");
}

// --- Routes ---
app.get("/", (req, res) => {
    res.render("login", { user: req.user });
});
app.post('/profile', (req, res) => {
    const updatedData = req.body; // Requires express.urlencoded()
    // TODO: Save the updated data to the database

    console.log("Received profile update:", updatedData);

    // Redirect back to profile page after saving
    res.redirect('/profile');
});


app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => res.redirect("/profile")
);

app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => res.redirect("/profile")
);

app.get("/profile", ensureAuth, (req, res) => {
    res.render("profile", { user: req.user });
});

app.get("/logout", (req, res) => {
    req.logout(() => res.redirect("/"));
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
