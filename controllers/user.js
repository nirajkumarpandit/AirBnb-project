const User = require("../models/user.js");
const passport = require("passport");

module.exports.signupForm = (req, res) => {
  res.render("./users/signup.ejs")
}

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body // jo body se aa raha hai
    const newUser = new User({ email, username }) // new user with email and username
    // use register method to register the user
    const registeredUser = await User.register(newUser, password)
    // Signup ke turant baad user ko login karao
    req.login(registeredUser, (err) => { 
      if (err) return next(err); 
      req.flash("success", "Welcome, you are signed up and logged in!"); 
      res.redirect("/Listings"); // ab currUser set hoga aur logout dikhega 
      });
   
  }
  catch (err) {
    req.flash("error", err.message)
    res.redirect("/signup")
  }
}
module.exports.loginForm = (req, res) => {
  res.render("./users/login.ejs")
}
module.exports.login= async (req, res) => {
    req.flash("success","welcome to AirBnb")
    let redirect=res.locals.redirectUrl || "/Listings"
    res.redirect(redirect)
}
module.exports.logout =(req,res, next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","you Logout now!")
    res.redirect("/Listings")
  })
}