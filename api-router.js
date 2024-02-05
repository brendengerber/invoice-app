//Imports necessary modules
const express = require('express');
require('dotenv').config();

//Creates the router
const apiRouter = express.Router();

//Mounts the invoiceRouter
const invoiceRouter = require('./routers/invoice-router.js');
apiRouter.use('/invoices', invoiceRouter);

//Mounts the authRouter
const authRouter = require('./routers/authentication-router.js');
apiRouter.use('/authentication', authRouter);

//Handles all unhandled errors
apiRouter.use((err, req, res, next) => {
    if(!err.status){
      err.status = 500;
    }
    res.status(err.status).send(err.message);
  });

//Exports the router
module.exports = apiRouter;