const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);

    if (!user) {
      return done(null, false, { message: "No user with the given email" });
    }

    try {
      const isCorrect = await bcrypt.compare(password, user.password);

      if (isCorrect) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
}

module.exports = initialize;
