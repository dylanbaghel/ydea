//THIRD PARTY MODULES
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//CUSTOM MODULES FILES
const { User } = require('./../models/User');

//Users Routes

//GET - /users/login - LOGIN USER FORM
router.get('/login', (req, res) => {
    res.render('users/login');
});

//GET - /users/register - REGISTER USER FORM
router.get('/register', (req, res) => {
    res.render('users/register');
});

//POST - /users/register - ADD NEW USER
router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    let errors = [];

    if (password.length < 4) {
        errors.push({ text: 'Password Must be atlease of 4 characters' });
    }
    if (password !== password2) {
        errors.push({ text: 'Passwords Do Not Match' });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {

        User.findOne({
            email: email
        }).then((user) => {
            if (user) {
                req.flash('error_msg', 'Email Already Taken');
                res.redirect('/users/register');
            } else {
                let user = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;

                        user.save().then((user) => {
                            req.flash('success_msg', 'You are registered now can log in');
                            res.redirect('/users/login');
                        }).catch((e) => {
                            console.log('err', e);
                        });
                    });
                });
            }
        })


    }
});

//POST - /users/login - LOGIN EXISTING USER
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//GET - /users/logout - LOGOUT USER
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Successfully Logged Out');
    res.redirect('/users/login');
});

module.exports = router;