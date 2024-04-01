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

const userRouter = require('./routers/user-router.js');
apiRouter.use('/user', userRouter);

//Handles all unhandled errors
apiRouter.use((err, req, res, next) => {
  if(!err.status){
      err.status = 500;
    }
    //Does not discolse error message to potential bad actors while in production, but allows 404s for empty queries as this is useful for the front end
    if(process.env.NODE_ENV === 'production' && err.status !== 404){
      res.status(500).json({message: "An unknown server error has occured"});
    }else{
      res.status(err.status).json({message: err.message});
    }
  });

//Exports the router
module.exports = apiRouter;