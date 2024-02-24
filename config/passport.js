//Imports
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
require("dotenv").config();
const db = require('../models/index.js');
const {unwrapQueryResults} = require('../utilities/database-utilities.js')

//Configures passport to use the Github Strategy
//Callback URL must match what is set in github Oauth app settings
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BACK_END_URL}/authentication/github/callback`
        },
        //This portion is called if there is no open session (i.e. the browser does not send a cookie)
        //It then associates the github profile to a user in the application database 
        //This is done by matching the provider and id in the profile to provider and remoteId in the app database via an sql query
        //Or if one doesnt exist it creates the user via an sql query, using the github profile for the column data (assigning the app specific uuid used to look up data in other tables along with other relevant data like email)
        //This user is then attatched to req.user
        //It then creates a session by assigning and storing a cookie in the session database 
        //Then it serializes the User for subsequent requests while the session is ongoing by saving the req.user.id to the session
        //This id can then be used by deserialize when it recieves the session cookie to look up and attatch the full user object to req.user
        //Note that req.user will now be the full user from the app database not the oauth profile
        (accessToken, refreshToken, profile, done) => {
            console.log(profile._json.avatar_url)
            //Finds a user based on the provider and providerId/remoteId from the profile obtained by Oauth
            //If the user does not exist it creates one and assigns it an app specific UUID
            db.user.findOrCreate({
                where: {
                    provider: profile.provider,
                    remoteId: profile.id
                },
                defaults: {
                    photoUrl: profile._json.avatar_url,
                    email: profile._json.email
                }
            }).then(results => {
                return unwrapQueryResults(results)
            }).then(results => {
                done(null, results[0])
            }).catch(err => done(err))           
        }
    )
);
//Serializes the app specific User object when creating a new session
//Saves the UUID with the cookie to the session database, which is used for looking up the entire user object in the app database via deserializeUser on subsequent requests
passport.serializeUser((user, done) => {
    done(null, user.id);
});
//Deserializes the user upon subsequent requests with an open session by matching the cookie to a session in the session database
//Uses the UUID stored in the session by serializeUser to look up the full user from the app users database and attatch it to req.user
passport.deserializeUser((id, done) => {
    db.user.findByPk(id)
    .then(result => {
        done(null, result)
    })
    .catch(err => done(err))    
});

module.exports = passport;