const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return redirect("/");
  }
  next();
};

module.exports = checkNotAuthenticated;
