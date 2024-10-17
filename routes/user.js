const express=require('express');
const router=express.Router({mergeParams:true});//to connect the common part and the child part merged
const User=require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const { route } = require('./listing');
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
try{
    let {username,password,email}=req.body;
    const newUser=new User({email,username});
    
    let userregistered=await User.register(newUser,password);
    
    //this is login after signup user signup and auto login after this 
    req.login(userregistered,(err)=>{
        if((err)=>{
           return next(err);
        });
          console.log(userregistered);
    req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
    });
    
  
}catch(e){
req.flash("error",e.message);
res.redirect("/signup");
}
}));


router.get('/login',(req,res)=>{
    res.render("user/login.ejs");
});


//for matching the password and username to our account in the DB
//failure flash when there is problem in the login it displays the flash message 
router.post('/login',saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),

    async(req,res)=>{
        let {username}=req.body;
req.flash("success",`Welcome Back to WanderLust`);
let redirect=res.locals.redirectUrl || "/listings";
//by this make the flow of the page

res.redirect(redirect);
});


router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        next(err);
      }
      req.flash("success","You Logged Out Successfully");
      res.redirect("/listings");
    });
});

module.exports=router;