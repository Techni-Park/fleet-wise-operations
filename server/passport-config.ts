import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import { UserSystem } from "../shared/schema";

passport.use(new LocalStrategy(
  { usernameField: 'CDUSER' }, // Use CDUSER as the username field
  async (CDUSER, password, done) => {
    try {
      const user = await storage.getUserByCDUSER(CDUSER);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // In a real application, you would hash and compare passwords securely
      if (user.PASSWORD !== password) { // This is a placeholder, replace with secure password comparison
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, (user as UserSystem).IDUSER);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
