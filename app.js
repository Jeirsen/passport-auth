// URL Youtube material https://www.youtube.com/watch?v=6FOq4cUdH8k&t=233s
// Traversy Media
const express = require("express");
var expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

require("./config/passport")(passport);

const app = express();

// DB Config
const keys = require("./config/keys");

// Connect with Mongo Atlas
mongoose
  .connect(keys.mongoURI, { autoIndex: false, useNewUrlParser: true })
  .then(
    () => {
      console.log("Got it, connected with mongodb atlas!!");
    },
    err => {
      console.log(err);
    }
  )
  .catch(err => console.log(err));

// EJS Layout
app.use(expressLayouts);
app.set("view engine", "ejs");

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/user"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
