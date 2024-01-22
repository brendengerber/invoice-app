//Imports
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
require("dotenv").config();
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

//Configures passport to use the Github Strategy
//Callback URL must match what is set in github Oauth app settings
passport.use(
    new GitHubStrategy(
        {
            githubOauthClientID: GITHUB_CLIENT_ID,
            githubOauthClientSecret: GITHUB_CLIENT_SECRET,
            githubOauthCallbackURL: "http://localhost:3000/api/auth/github/callback"
        },
        //Associates the github profile to a user in the application database (where a uuid is assigned and used to look up data in other tables)
        //And creates the user if it does not exist
        //req.user will now be the full user from my database not the oauth profile
        (accessToken, refreshToken, profile, done) => {
            findUserByOauthProfile(profile)
            .then(result => {
                if(result === null){
                    return createUserByOauthProfile(profile)
                }
                return result
            })
            //****if doesn't work, should this be done(err, result) and remove the catch? */
            //like https://www.passportjs.org/packages/passport-github2/
            .then(result => done(null, result)) 
            .catch(err => done(err))           
        }
    )
);

//Serializes the Github user profile, saving provider and the id from the provider (remoteId) for looking up the entire user object in the app database via deserialize on subsequent requests
passport.serializeUser((user, done) => {
    done(null, user.uuid);
});

//Deserializes the user upon subsequent requests with an open session. Uses remoteId and provider stored to the session database by serialize to look up the full user from the app users database table (including their assigned uuid linked to other tables)
passport.deserializeUser((uuid, done) => {
    findUserByUuid(uuid)
    .then(done(null, result))
    .catch(err => done(err))    
});


module.exports = passport;      



