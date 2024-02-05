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
    failureRedirect: `${process.env.URL}/login`,
    successRedirect: `${process.env.URL}/home`
}));

module.exports = authRouter;