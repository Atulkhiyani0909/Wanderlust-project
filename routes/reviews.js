const express=require('express');
const router=express.Router({mergeParams:true});//to connect the common part and the child part merged

const wrapAsync=require('../utils/wrapAsync.js');

const Review=require("../models/review.js");
const Listing = require("../models/listing.js");

const {listingSchema,reviewSchema}=require('../schema.js');
const ExpressError=require('../utils/ExpressError.js');
const {validateReview}=require("../middleware.js");

const {isLogedIN}=require("../middleware.js");


  

//Reviews 
//post route review

//common part /listings/:id/reviews
router.post("/",isLogedIN,validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    console.log(req.body);
    console.log(req.body.review);
    
    listing.reviews.push(newReview);
    newReview.author=req.user._id;//to store that the current user is the author of that review
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review created !!!");
    res.redirect(`/listings/${req.params.id}`); 
    }));
    
    
    
    //Delete route review
    router.delete("/:reviewID", wrapAsync(async (req, res) => {
        let { id, reviewID } = req.params; // Ensure 'id' is the listing ID and 'reviewID' is the review ID
        console.log(id, reviewID);
        
        // First, find the listing to ensure it exists
        const listing = await Listing.findById(id);
       
    
        // Remove the review ID from the listing's reviews array
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
        
        // Delete the review
        let result = await Review.findByIdAndDelete(reviewID);
        
    
        console.log(result);
        req.flash("success","Review Deleted !!!");
        res.redirect(`/listings/${id}`);
    }));




    module.exports=router;