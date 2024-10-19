const express=require('express');
const router=express.Router({mergeParams:true});//to connect the common part and the child part merged

const wrapAsync=require('../utils/wrapAsync.js');

const Review=require("../models/review.js");
const Listing = require("../models/listing.js");

const {listingSchema,reviewSchema}=require('../schema.js');
const ExpressError=require('../utils/ExpressError.js');
const {validateReview}=require("../middleware.js");

const {isLogedIN}=require("../middleware.js");

//MVC
const reviewController=require("../controller/review.js");
  

//Reviews 
//post route review

//common part /listings/:id/reviews
router.post("/",isLogedIN,validateReview,wrapAsync(reviewController.createReviewData));
    
    
    
    //Delete route review
    router.delete("/:reviewID",wrapAsync(reviewController.destroyReview));




    module.exports=router;