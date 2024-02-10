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
    failureRedirect: `/authentication/failure`,
    successRedirect: `/authentication/success`
}));

//Redirects callback redirects from Oauth to the front end pages not hosted on the api subdomain
authRouter.get('/failure', (req, res, next) => {
    res.status(401).send();
});

authRouter.get('/success', (req, res, next) => {
    res.status(200).send(req.user);
});

//Logs out of any open passport session
authRouter.post('/logout', (req, res, next) => {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect('/');
    })
})

module.exports = authRouter;