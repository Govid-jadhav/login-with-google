// models/User.js
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // works for both email or username
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String, // store Google OAuth ID
        unique: true,
        sparse: true
    },
    githubId: {
        type: String, // store GitHub OAuth ID
        unique: true,
        sparse: true
    },
    profilePic: {
        type: String // optional profile picture from OAuth
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Adds password hash + authenticate methods (for local login)
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
