import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

export const Passport = async () => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };
  passport.use(
    new JwtStrategy(options, async (payload, cb) => {
      try {
        const { id } = payload;
        return cb(null, { id });
      } catch (error) {
        return cb(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
