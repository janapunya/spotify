const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const authcontroller = require('../controllers/auth.controller'); 

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      const user = await authcontroller.userData(profile); 
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.email); 
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await authcontroller.findUser(email); 
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;