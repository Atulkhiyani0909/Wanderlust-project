const express=require('express');
const router=express.Router({mergeParams:true});//to connect the common part and the child part merged

const wrapAsync=require('../utils/wrapAsync.js');

const Review=require("../models/review.js");
const Listing = require("../models/listing.js");

const {listingSchema,reviewSchema}=require('../schema.js');
const ExpressError=require('../utils/ExpressError.js');





//this is for validating the review schema using the joi 
//by this we even cannot send the wrong data by Hoppscotch also 
const validateReview= (req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);
    if(error){
      const msg=error.details.map(el=>el.message).join(',');
      throw new ExpressError(error.details[0].message,400);
    }
    next();
  }
  

//Reviews 
//post route review

//common part /listings/:id/reviews
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    
    
    let newReview=new Review(req.body.review);
    console.log(req.body.review);
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
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
        res.redirect(`/listings/${id}`);
    }));




    module.exports=router;