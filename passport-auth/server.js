require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const users = [];

const initializePassport = require("./passport-config");
initializePassport(passport, (email) => {
  return users.find((user) => user.email === email);
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/", checkAuth(true, "/login"), (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

app.get("/login", checkAuth(false, "/"), (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkAuth(false, "/"),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkAuth(false, "/"), (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkAuth(false, "/"), async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch (err) {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function checkAuth(expectedValue, redirectUrl) {
  return (req, res, next) => {
    if (req.isAuthenticated() === expectedValue) {
      next();
      return;
    }

    res.redirect(redirectUrl);
  };
}

app.listen(8000);
