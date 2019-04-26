const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Use model
const User = require("../models/User");

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login page
router.get("/register", (req, res) => {
  res.render("register");
});

// Register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check match passwords
  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Chack password length
  if (password.length < 6) {
    errors.push({ msg: "Passwors should be grater that 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            errors.push({ msg: "Error trying to salt the password" });
          } else {
            const newUser = new User({
              name,
              email,
              password: hash
            });

            newUser
              .save()
              .then(result => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                errors.push({
                  msg: "Error save the new user into the database",
                  err
                });
              });
          }
        });
      }
    });
  }
});

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// LogOut Handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_mgs", "You success logged out");
  res.redirect("/users/login");
});

module.exports = router;
