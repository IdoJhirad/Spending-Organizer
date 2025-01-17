import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from "../config/db.js";

/**
 *  passport middleware with the GoogleStrategy. This handles the core logic for authenticating a user 
    using Google OAuth and integrating it with db */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
      callbackURL: '/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        // Check if the user already exists
        const existingUser = await db.query('SELECT * FROM users WHERE google_id = $1 OR email = $2', [googleId, email]);

        let user = existingUser.rows[0];

        if (user) {
          if (!user.google_id) {
            // Update the existing user with the Google ID
            const updatedUserResult = await db.query(
              `UPDATE users SET google_id = $1 WHERE email = $2 RETURNING *`,
              [googleId, email]
            );
            user = updatedUserResult.rows[0];
          }
        } else {
          // Create a new user if they don't exist
          const newUserResult = await db.query(
            `INSERT INTO users (google_id, email, name, password, is_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [googleId, email, name, 'GOOGLE_AUTH_USER', true] // Automatically verify Google users
          );
          user = newUserResult.rows[0];
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

