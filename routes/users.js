const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// User Login get
router.get('/login', (req, res) => {
    res.render('login', {title: "Login Page"});
});

// User Login post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    // req.flash('success', 'You are logged in');
});

// Users Route
router.get('/', ensureAuthentication, (req, res) => {
    User.find({}, (err, user) => {
        if(err)
            console.log(err);
        else
            res.render('users', {title: "Registered Users", user});
    });
});

// User Registers
router.get('/register', (req, res) => {
    res.render('register', {title: "Registration Form"});
});

// Post Registration
router.post('/register', (req, res) => {
    let newUser = new User();
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.username = req.body.username;

    bcrypt.genSalt(10, (err, salt) => {
        if(err)
        {
            console.log(err);
            return;
        }
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) 
                console.log(err);
            else
            {
                newUser.password = hash;
                newUser.save( (err) => {
                    if(err)
                    {
                        console.log(err);
                        return;
                    }
                    else{
                        req.flash('success','You are now registered and can log in ');
                        res.redirect('/users/login');
                    }        
                });
            }
        });
    }); 
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});

function ensureAuthentication(req, res, next){
    if(req.isAuthenticated())
        return next();
    else{
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;