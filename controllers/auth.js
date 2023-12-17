const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const getRegister = (req, res) => {
  return res.render("pages/register");
};

const postRegister = async (req, res) => {
  const { name, username, password, email } = req.body;

  // Validation
  if (!name) {
    req.flash("error", "Name is required!");
    return redirect("/register");
  }
  if (!username) {
    req.flash("error", "Username is required!");
    return redirect("/register");
  }
  if (!email) {
    req.flash("error", "Email is required!");
    return redirect("/register");
  }
  if (email) {
    const regexCode =
      '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/';
    if (!username.match(regexCode)) {
      req.flash("error", "Email is not valid!");
      return redirect("/register");
    }
  }
  if (!password) {
    req.flash("error", "Password is required!");
    return redirect("/register");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const save = await newUser.save();
    if (save) {
      req.flash("success", "Registration successful!");
      return res.redirect("/login");
    } else {
      req.flash("error", "Registration failed!");
      return redirect("/register");
    }
  } catch (error) {
    req.flash("error", error.message);
    return redirect("/register");
  }
};

const getLogin = (req, res) => {
  return res.render("pages/login", { messages: { error: null } });
};

const postLogin = async (req, res) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  });
};

const logout = (req, res, next) => {
  req.session.destroy();
  res.clearCookie("token");
  return res.redirect("/login");
};

module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  logout,
};
