// models/User.js
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false // Make optional for OAuth users
    },
    email: {
        type: String,
        required: false, // Make optional for OAuth users
        unique: false // Don't enforce strict unique here, because some OAuth providers don't give email
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true
    },
    displayName: {
        type: String
    },
    photo: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Allow passport-local-mongoose for local login
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
