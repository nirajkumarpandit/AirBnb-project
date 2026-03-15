const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const User = require("../models/user.js");
const passport = require("passport");
const { isLogedIn,saveUrl } = require("../middleware.js");
const userController =require("../controllers/user.js")

router.get("/signup", userController.signupForm)
router.post("/signup", wrapAsync(userController.signup))
// Login page render
router.get("/login", userController.loginForm)
// post request
router.post("/login",saveUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),userController.login)
// Logout using req.logout method 
router.get("/logout",userController.logout)

module.exports = router