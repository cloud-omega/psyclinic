import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import dotenv from 'dotenv';

// Import user model (to be created)
import User from '../models/user';

// Load environment variables
dotenv.config();

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret_key'
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id);
      
      if (!user) {
        return done(null, false);
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await User.findOne({
            where: { email: profile.emails[0].value }
          });
          
          if (!user) {
            // Create new user
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              profilePicture: profile.photos[0].value,
              role: 'patient', // Default role
              googleId: profile.id
            });
          } else if (!user.googleId) {
            // Update existing user with Google ID
            await user.update({ googleId: profile.id });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await User.findOne({
            where: { email: profile.emails[0].value }
          });
          
          if (!user) {
            // Create new user
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              profilePicture: profile.photos[0].value,
              role: 'patient', // Default role
              facebookId: profile.id
            });
          } else if (!user.facebookId) {
            // Update existing user with Facebook ID
            await user.update({ facebookId: profile.id });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
}

// LinkedIn Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: '/api/auth/linkedin/callback',
        scope: ['r_emailaddress', 'r_liteprofile']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await User.findOne({
            where: { email: profile.emails[0].value }
          });
          
          if (!user) {
            // Create new user
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              profilePicture: profile.photos[0].value,
              role: 'patient', // Default role
              linkedinId: profile.id
            });
          } else if (!user.linkedinId) {
            // Update existing user with LinkedIn ID
            await user.update({ linkedinId: profile.id });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
}

export default passport;