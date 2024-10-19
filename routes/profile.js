const mongoose=require('mongoose');
const express=require('express');

const router=express.Router();//express router for routing

const ExpressError=require('../utils/ExpressError.js');
const {isLogedIN}=require("../middleware.js");
const Listing=require("../models/listing.js");


router.get("/profile",isLogedIN,async (req,res)=>{
    if(!res.locals.currUser){
        req.flash('error',"Login to view profile");
        return res.redirect("/login");
    }
    const userId=res.locals.currUser._id;
    if(!mongoose.Types.ObjectId.isValid(userId)){
      throw new ExpressError("Invalid User",400);
    }
    //using new is necessary for the checking inside the which is refrence than use new and mongoose.types.ObjectId to check
    let listings = await Listing.find({ owner: new mongoose.Types.ObjectId(userId) }); // Use mongoose.Types.ObjectId
    res.render("profile/profile.ejs", { user: res.locals.currUser,listings});
});



module.exports=router;