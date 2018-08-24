const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//CUSTOM MODULE FILES
const { User } = require('./../models/User');


module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({
            email: email
        }).then((user) => {
            if(!user) {
                return done(null, false, {message: 'No User Found'});
            }

            //Match password
            bcrypt.compare(password, user.password).then((isMatch) => {
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Password Incorrect'});
                }
            }).catch((e) => {
                throw e;
            })
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};