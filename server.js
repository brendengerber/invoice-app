//Imports necessary modules
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
var SequelizeStore = require("connect-session-sequelize")(session.Store);
const { xss } = require('express-xss-sanitizer');

const passport = require('./config/passport.js');
const db = require('./models/index.js')

//Creates the server
const app = express();

//Sets the server's port
const PORT = process.env.PORT || 3000;

//Adds helpful logs when server is set to development
if(process.env.NODE_ENV === "development"){
  app.use(morgan('tiny'));
};

//Parses request bodies to json
app.use(express.json());
//Parses request urlencoded data to json
app.use(express.urlencoded({extended: true}));

//Sets up cors
app.use(
  cors({
    //Allows session cookie from browser to pass through
    credentials: true, 
    //Sets the allowed domain to the domain where the front end is hosted
    origin: process.env.FRONT_END_URL
  })
);

//Security measures
app.use(helmet());
app.disable('x-powered-by');
app.use(xss());

//Configures the session store
var sessionStore = new SequelizeStore({
  db: db.sequelize
});

//Creates the session store in the database if it doesn't exist, uncomment for first run on a fresh db
// sessionStore.sync();

//Sets up Express session to be used on all routes
//Sets cookie settings depending on NODE_ENV to allow frontend to send credentials appropriately in requests
//Samesite none can be used with secure to test a local front end with a hosted back end, but appears it will be deprecated soon
//*****Might need to playe with sameSite in production, but should work if one is hosted on a subdomain */
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    proxy: true,
    saveUninitialized: false,
    httpOnly: true,
    cookie: { 
      sameSite: 'none',
      secure: process.env.NODE_ENV === "production" ? "true" : process.env.NODE_ENV === "development" ? "auto" : "true",
      maxAge: 1000 * 60 *60 * 24
    },
    store: sessionStore
  })
);

//Initializes passport to be used on all routes
app.use(passport.initialize());
app.use(passport.session());

//Mounts the api router
const apiRouter = require('./api-router.js');
app.use('/', apiRouter);

//Confirms database connection
db.sequelize.authenticate()
.then(() => console.log('Database connection has been established successfully'))
.catch(err => console.error('Unable to connect to the database:', err));

//Starts server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
  