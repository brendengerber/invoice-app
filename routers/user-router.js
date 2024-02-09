//Imports necessary modules
const express = require('express');
require('dotenv').config();

//Creates the router
const userRouter = express.Router();

userRouter.get('/', (req, res, next) => {
    res.status(200).send(req.user)
});

module.exports = userRouter;