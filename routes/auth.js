const express = require("express");
const router = express.Router();
const {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  logout,
} = require("../controllers/auth");
const checkNotAuthenticated = require("../middleware/checkNotAuthenticated");
const checkAuthenticated = require("../middleware/checkAuthenticated");

router.get("/login", checkNotAuthenticated, getLogin);
router.post("/login", checkNotAuthenticated, postLogin);
router.get("/register", checkNotAuthenticated, getRegister);
router.post("/register", checkNotAuthenticated, postRegister);
router.get("/logout", checkAuthenticated, logout);

module.exports = router;
