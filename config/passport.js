const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    // Local Strategy
    passport.use(new localStrategy( (username, password, done) => {
        // Match Username
        let query = {username: username};
        User.findOne(query, (err, user) => {
            if(err) throw err;
            if(!user)
                return done(null, false, {message: "No User Found"});
            
            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(!isMatch)
                    return done(null, false, {message: "Incorrect Password"});

                // Password matches
                return done(null, user);
            });
        });
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}