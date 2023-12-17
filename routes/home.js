const express = require("express");
const router = express.Router();
const { getHome } = require("../controllers/home");
const checkAuthenticated = require("../middleware/checkAuthenticated");

router.get("", checkAuthenticated, getHome);
module.exports = router;
