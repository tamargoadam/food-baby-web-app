/* Require statements */
const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin
var validate = require('mongoose-validator'); // Import Mongoose Validator Plugin

// Name Validator
var nameValidator = [
    validate({
        validator: 'matches',
        /* 
        * first name & space & last Name
        * The + means it needs to match one or more of the preceding tokens 
        */
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Name must be at least 3 characters, max 30, no special characters or numbers, must have space in between name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// User E-mail Validator
var emailValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9._%-]+@ufl.edu$/,
        message: 'Must be a ufl.edu email, and at least 3 characters but no more than 25'
    }),
    validate({
        validator: 'isLength',
        arguments: [3, 40],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];

// Username Validator
var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Username must contain letters and numbers only'
    })
];

// Password Validator
var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        message: 'Password needs to have at least one lower case, one uppercase, one number, one special character, and must be at least 8 characters but no more than 35.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
    })
];


// User Mongoose Schema
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: nameValidator
    },
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: usernameValidator
    },
    password: {
        type: String,
        required: true,
        validate: passwordValidator
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate: emailValidator
    }
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
UserSchema.methods.comparePassword = function (password) {
    // Returns true if password matches, false if doesn't
    // compare password provided by the user to the hash (this password of the current user)
    return bcrypt.compareSync(password, this.password);
};

// Mongoose Plugin to change fields to title case after saved to database (ensures consistency)
UserSchema.plugin(titlize, {
    paths: ['name']
});

/** Exporting the model makes it available to other part of our Node app */
module.exports = mongoose.model('User', UserSchema);