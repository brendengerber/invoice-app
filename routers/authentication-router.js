//Imports necessary modules
const express = require('express');
require('dotenv').config();
const passport = require('../config/passport.js');

//Creates the router
const authRouter = express.Router();

//*****add the frontend base url to .env.example and dokku config files and refactor below to use it */
//*********redirect to a success route that sends the user object and redirects to dashboard? */
//Sets the redirect URLs based on if the current environment is development or production
let failureRedirectURL;
let successRedirectURL;
let logoutRedirectURL;

if(process.env.NODE_ENV === 'production'){
    failureRedirectURL = `${process.env.FRONT_END_URL}/login/`;
    successRedirectURL = `${process.env.FRONT_END_URL}/dashboard/`;
    logoutRedirectURL = `${process.env.FRONT_END_URL}/login/`;
}else if(process.env.NODE_ENV === 'development'){
    failureRedirectURL = `http://localhost:3000/login/`;
    successRedirectURL = `http://localhost:3000/dashboard/`;
    logoutRedirectURL = `http://localhost:3000/login/`;
}

//Authenticates via github oauth
authRouter.get('/github', passport.authenticate('github', {scope: ['user']}));

//Callback route which Github will call following the authentication attempt
//User will be redirected based on the success of the authentication attempt
authRouter.get('/github/callback', passport.authenticate('github', {
    failureRedirect: failureRedirectURL,
    successRedirect: successRedirectURL
}));

authRouter.get('test', (req, res, next) => {
    res.send({"body": "yay"})
})


//Logs out of any open passport session
authRouter.post('/logout', (req, res, next) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect(logoutRedirectURL);
    })
});

module.exports = authRouter;