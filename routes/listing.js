const express=require('express');

const router=express.Router();//express router for routing

const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require('../models/listing.js');
const {listingSchema,reviewSchema}=require('../schema.js');//validated joi schema required 
const ExpressError=require('../utils/ExpressError.js');
const {isLogedIN, isOwner, validateListing}=require("../middleware.js");

const multer  = require('multer');
const {storage}=require('../cloudConfig.js');
const upload = multer({ storage });



//this controller is the type of the MVC which makes the code more compact
  const listingController=require("../controller/listings.js");



//MORE COMPACT router.route
router.route("/")
.get(wrapAsync(listingController.index))

//create new listing route 
   //using the wrapAsync function to handle the error from the database
   //and using the validateListing function to validate the data we get from the form
   
.post(
   isLogedIN,
   upload.single('image'), //this is of the cloudinary multer to store the img 
  validateListing,
   wrapAsync(listingController.createListingdata)
  );   
  

  
   //new listing route
   router.get("/new",isLogedIN,wrapAsync(listingController.renderNewForm));
   


   
   router
   .route("/:id")
//show listing route
    .get(wrapAsync(listingController.showListings))

 // update listing route
    .put(isLogedIN,isOwner,
      upload.single('image'),
      validateListing,wrapAsync(listingController.updateListingData))
//delete listing route
    .delete(isOwner,isLogedIN,wrapAsync(listingController.destroyListing)) ; 
   


   
   //edit listing route
   router.get("/:id/edit",isLogedIN,wrapAsync(listingController.editListingForm));
   
   
  router.post("/search",async (req,res)=>{
     let Searchcity=req.body.query;
     Searchcity = Searchcity.charAt(0).toUpperCase() + Searchcity.slice(1).toLowerCase();
     let allListings=await Listing.find({location:Searchcity});
     console.log(allListings);
     res.render("listing/index.ejs",{allListings});
  });
  
   module.exports=router;