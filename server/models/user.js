/* Require statements */
const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package

// User Mongoose Schema
var UserSchema = new mongoose.Schema({
    // name: { type: String, required: true, validate: nameValidator },
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    // active: { type: Boolean, required: true, default: false },
    // temporarytoken: { type: String, required: true },
    // resettoken: { type: String, required: false },
    // permission: { type: String, required: true, default: 'moderator' }
});

/** 
 * Before saving the schema, we want to encrypt the password
 * Middleware to ensure password is encrypted before saving user to database
 */
UserSchema.pre('save', function (next) {
    var user = this; // whatever user running through this middleware

    // if (!user.isModified('password')) return next(); // If password was not changed or is new, ignore middleware

    // Function to encrypt password 
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err); // Exit if error is found
        // Assign the hash to the user's password so it is saved in database encrypted
        user.password = hash; 
        next(); // next() will exit Bcrypt function
    });
});

// Method to compare passwords in API (when user logs in) 
UserSchema.methods.comparePassword = function(password) {
    // Returns true if password matches, false if doesn't
    // compare password provided by the user to the hash (this password of the current user)
    return bcrypt.compareSync(password, this.password); 
};

/** Exporting the model makes it available to other part of our Node app */
module.exports = mongoose.model('User', UserSchema);