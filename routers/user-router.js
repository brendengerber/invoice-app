//Imports necessary modules
const express = require('express');
require('dotenv').config();
const {ensureAuthenticated} = require('../middleware/authentication-middleware.js');


//Creates the router
const userRouter = express.Router();

userRouter.get('/', ensureAuthenticated, (req, res, next) => {
    res.status(200).send(req.user);
});

module.exports = userRouter;