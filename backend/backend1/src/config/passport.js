const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
// const { generateToken } = require("../utils/jwt.utils");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    authProvider: "google",
                    avatar: {
                        url: profile.photos[0].value,
                        public_id: ""
                    },
                    role: ["user"]
                });
            }
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
));
