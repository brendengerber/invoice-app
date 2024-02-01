//Imports
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
require("dotenv").config();


//Configures passport to use the Github Strategy
//Callback URL must match what is set in github Oauth app settings
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.URL}/api/auth/github/callback`
        },
        //This portion is called if there is no open session (i.e. the browser does not send a cookie)
        //It then associates the github profile to a user in the application database by matching the provider and id in the profile to provider and remoteId in the app database
        //Or creates the user if it does not exist using the github profile (assigning the app specific uuid used to look up data in other tables along with other relevant data like email)
        //It then creates a session by assigning and storing a cookie in the session database 
        //Then serializes the User for subsequent requests while the session is ongoing
        //Note that req.user will now be the full user from the app database not the oauth profile
        (accessToken, refreshToken, profile, done) => {
            //Finds a user based on the provider and providerId/remoteId from the profile obtained by Oauth
            //If the user does not exist it creates one and assigns it an app specific UUID
            return db.User.findOrCreate({
                where: {
                    provider: profile.provider,
                    remoteId: profile.id
                },
                defaults: {
                    photoUrl: profile.avatar_url,
                    email: profile.email
                }
            })
            //****if doesn't work, should this be done(err, result) and remove the catch? */
            //like https://www.passportjs.org/packages/passport-github2/
            .then(result => done(null, result)) 
            .catch(err => done(err))           
        }
    )
);
//Serializes the app specific User object when creating a new session
//Saves the UUID with the cookie to the session database, which is used for looking up the entire user object in the app database via deserializeUser on subsequent requests
passport.serializeUser((user, done) => {
    done(null, user.id);
});
//Deserializes the user upon subsequent requests with an open session by looking up the cookie in the session database
//Uses the UUID stored to the session database by serializeUser to look up the full user from the app users database table and attatching it to req.User
passport.deserializeUser((id, done) => {
    return db.User.findByPk(id)
    .then(done(null, result))
    .catch(err => done(err))    
});

module.exports = passport;      



