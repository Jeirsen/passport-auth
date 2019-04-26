module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error_msg", "Plase log in to view this resource");
      res.redirect("/users/login");
    }
  }
};
