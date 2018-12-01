var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user'); // Import User Model
var session = require('express-session'); // Import Express Session Package
const jwt = require('jsonwebtoken');
var secret = 'pickles'; //should be private


var passport = function (app, passport) {

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
    passport.serializeUser(function (user, done) {
        jwt.sign({
            username: user.username,
            email: user.email
        }, secret, {
            // token will expire in 24 hours
            expiresIn: '24h'
        });
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: '1210152449147080',
            clientSecret: 'f5df35153ed8653d6ad84e172d4dc7aa',
            callbackURL: "https://localhost:4000/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos', 'email'] //customize of what we get from FB
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile._json.email);
            if (profile.emails) {
                User.findOne({
                    email: profile._json.email
                }).select('username password email').
                exec(function (err, user) {
                    if (err) {
                        done(err);
                    } else {
                        if (user && user != null) {
                            done(null, user);
                        } else {
                            done(err);
                        }
                    }
                });
            } else {
                user = {}; // Since no user object exists, create a temporary one in order to return an error
                user.id = 'null'; // Temporary id
                user.active = true; // Temporary status
                user.error = true; // Ensure error is known to exist
                done(null, user); // Serialize and catch error
            }

        }
    ));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }), function(req, res){
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