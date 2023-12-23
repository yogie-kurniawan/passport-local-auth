const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const getRegister = (req, res) => {
  return res.render("pages/register", { error: req.flash("error") });
};

const postRegister = async (req, res) => {
  const { name, username, password, email } = req.body;
  let errors = {};

  // Validation
  if (!name) {
    errors.name = { msg: "Name is required!" };
  }
  if (!username) {
    errors.username = { msg: "Username is required!" };
  }
  if (!email) {
    errors.email = { msg: "Email is required!" };
  } else if (!email.match(/^\S+@\S+\.\S+$/)) {
    errors.email = { msg: "Email is not valid!" };
  }
  if (!password) {
    errors.password = { msg: "Password is required!" };
  }

  try {
    let valueExists = async (field, value) => {
      return await User.findOne({ [field]: value });
    };

    if (await valueExists("username", username)) {
      errors.username = { msg: "Username already exists!" };
    }
    if (await valueExists("email", email)) {
      errors.email = { msg: "Email already exists!" };
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "Failed to register!");
    return res.redirect("/register");
  }

  if (Object.keys(errors).length > 0) {
    return res.render("pages/register", {
      errors,
      name,
      username,
      email,
      password,
      error: req.flash("error"),
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    req.flash("success", "Registration successful!");
    return res.redirect("/login");
  } catch (err) {
    req.flash("error", err.message);
    return res.render("pages/register", {
      errors,
      name,
      username,
      email,
      password,
      error: req.flash("error"),
    });
  }
};

const getLogin = (req, res) => {
  return res.render("pages/login", {
    error: req.flash("error"),
    success: req.flash("success"),
  });
};

const postLogin = async (req, res) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  });
};

const logout = (req, res, next) => {
  req.logOut();
  return res.redirect("/login");
};

module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  logout,
};
