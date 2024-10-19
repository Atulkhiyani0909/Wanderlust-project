const express=require('express');

const router=express.Router();//express router for routing

const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require('../models/listing.js');
const {listingSchema,reviewSchema}=require('../schema.js');//validated joi schema required 
const ExpressError=require('../utils/ExpressError.js');
const {isLogedIN, isOwner, validateListing}=require("../middleware.js");

//this controller is the type of the MVC which makes the code more compact
  const listingController=require("../controller/listings.js");



//MORE COMPACT router.route
router.route("/")
.get(wrapAsync(listingController.index))

//create new listing route 
   //using the wrapAsync function to handle the error from the database
   //and using the validateListing function to validate the data we get from the form
   
.post(
   isLogedIN,validateListing, 
   wrapAsync(listingController.createListingdata)
  );   
  
  
   //new listing route
   router.get("/new",isLogedIN,wrapAsync(listingController.renderNewForm));
   


   
   router
   .route("/:id")
//show listing route
    .get(wrapAsync(listingController.showListings))

 // update listing route
    .put(isLogedIN,isOwner,validateListing,wrapAsync(listingController.updateListingData))
//delete listing route
    .delete(isOwner,isLogedIN,wrapAsync(listingController.destroyListing)) ; 
   


   
   //edit listing route
   router.get("/:id/edit",isLogedIN,wrapAsync(listingController.editListingForm));
   
   
  
  
   module.exports=router;