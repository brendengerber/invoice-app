
//Imports necessary modules
const express = require('express');
require('dotenv').config();

//Creates the router
const oauthRouter = express.Router();

//Redirects callback redirects from Oauth to the front end pages not hosted on the api subdomain
oauthRouter.get('/failure', (req, res, next) => {
    res.redirect(`${process.env.FRONTEND_URL}/login`)
});

oauthRouter.get('/success', (req, res, next) => {
    res.redirect(`${process.env.FRONTEND_URL}/home`)
});

//Exports the router
module.exports = oauthRouter;