var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user'); // Import User Model
var session = require('express-session'); // Import Express Session Package
const jwt = require('jsonwebtoken');
var secret = 'pickles'; //should be private


var passport = function (app, passport) {
    // Start Passport Configuration Settings
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false
        }
    }));
    // End Passport Configuration Settings
    passport.serializeUser(function (user, done) {
        // Check if the user has an active account
        if (user.active) {
            // Check if user's social media account has an error
            if (user.error) {
                token = 'unconfirmed/error'; // Set url to different error page
            } else {
                token = jwt.sign({
                    username: user.username,
                    email: user.email
                }, secret, {
                    expiresIn: '24h'
                }); // If account active, give user token
            }
        } else {
            token = 'inactive/error'; // If account not active, provide invalid token for use in redirecting later
        }
        done(null, user.id); // Return user object
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: '1210152449147080',
            clientSecret: 'f5df35153ed8653d6ad84e172d4dc7aa',
            callbackURL: "https://food-baby-web-app.herokuapp.com/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos', 'email'] //customize of what we get from FB
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({
                email: profile._json.email
            }).select('username active password email').exec(function (err, user) {
                if (err) done(err);

                if (user && user !== null) {
                    done(null, user);
                } else {
                    done(err);
                }
            });

        }
    ));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }),
        function (req, res) {
            //success redirect to
            res.redirect('/facebook/' + token);
        }
    );

    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: 'email'
        })
    );

    return passport;
}

module.exports = passport;