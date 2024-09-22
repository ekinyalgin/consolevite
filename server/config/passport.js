const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const jwt = require('jsonwebtoken');
const db = require('./db');

const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.VITE_GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true // Req object passed here
    },
    async function (req, accessToken, refreshToken, profile, done) {
      try {
        const ip_address = req.ip; // IP address obtained from request
        const [rows] = await db.query('SELECT * FROM users WHERE google_id = ?', [profile.id]);
        let user;

        if (rows.length === 0) {
          // New user creation
          const username = profile.emails[0].value.split('@')[0];
          const newUser = {
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            username: username,
            email: profile.emails[0].value,
            google_id: profile.id,
            image: profile.photos[0].value,
            role_id: 2,
            ip_address: ip_address,
            last_login: new Date()
          };

          const [result] = await db.query('INSERT INTO users SET ?', newUser);
          newUser.id = result.insertId;
          user = newUser;
        } else {
          // Update existing user
          user = rows[0];
          await db.query('UPDATE users SET last_login = NOW(), ip_address = ? WHERE id = ?', [ip_address, user.id]); 
          user.last_login = new Date();
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        const newRefreshToken = jwt.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

        done(null, { user, token, refreshToken: newRefreshToken });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [jwt_payload.id]);
      if (rows.length > 0) {
        return done(null, rows[0]);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// We still need these for the Google strategy to work correctly
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
