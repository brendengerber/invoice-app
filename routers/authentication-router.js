//Imports necessary modules
const express = require('express');
require('dotenv').config();
const passport = require('../config/passport.js');

//Creates the router
const authRouter = express.Router();

//Authenticates via github oauth
authRouter.get('/github', passport.authenticate('github', {scope: ['user']}));

//Callback route which Github will call following the authentication attempt
//User will be redirected based on the success of the authentication attempt
authRouter.get('/github/callback', passport.authenticate('github', {
    failureRedirect: `${process.env.FRONT_END_URL}/login/`,
    successRedirect: `${process.env.FRONT_END_URL}/dashboard/`
}));

//Logs out of any open passport session
authRouter.post('/logout', (req, res, next) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect(`${process.env.FRONT_END_URL}/login/`);
    })
});

module.exports = authRouter;