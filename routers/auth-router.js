//Imports necessary modules
const express = require('express');
require('dotenv').config();
const passport = require('../config/passport.js');

//Creates the router
const authRouter = express.Router();

//Authenticates via github oauth
authRouter.post('/github', passport.authenticate('github', { failureRedirect: process.env.LOGIN_URL, failureMessage: true }));

module.exports = authRouter;