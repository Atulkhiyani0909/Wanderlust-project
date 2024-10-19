const express=require('express');
const router=express.Router({mergeParams:true});//to connect the common part and the child part merged
const User=require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const { route } = require('./listing');
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");

//MVC
const userController=require("../controller/user.js");


//Router.route More compact

//signup routes
router
.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.signupFormData));

    
  //Login Routes
router
.route('/login')
.get(userController.getLoginForm)

///for matching the password and username to our account in the DB
//failure flash when there is problem in the login it displays the flash message 
.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
userController.loginFormData);


//logout route
router.get("/logout",userController.logout);

module.exports=router;