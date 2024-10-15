const express=require('express');
const router=express.Router({mergeParams:true});//to connect the common part and the child part merged
const User=require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const { route } = require('./listing');
const passport=require("passport");


router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
try{
    let {username,password,email}=req.body;
    const newUser=new User({email,username});
    
    let userregistered=await User.register(newUser,password);
    
    console.log(userregistered);
    req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
}catch(e){
req.flash("error",e.message);
res.redirect("/signup");
}

}));


router.get('/login',(req,res)=>{
    res.render("user/login.ejs");
});

router.post('/login',passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
    async(req,res)=>{
req.flash("success","Welcome Back to WanderLust");
res.redirect("/listings");
});

module.exports=router;