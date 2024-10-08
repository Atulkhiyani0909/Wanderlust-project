const express=require('express');

const router=express.Router();

const wrapAsync=require('../utils/wrapAsync.js');
const Listing=require('../models/listing.js');
const {listingSchema,reviewSchema}=require('../schema.js');
const ExpressError=require('../utils/ExpressError.js');






//for the validation of the data
//using the joi for the validation
const validateListing= (req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error){
      const msg=error.details.map(el=>el.message).join(',');
      throw new ExpressError(error.details[0].message,400);
    }
    next();
  }
  


router.get('/',wrapAsync(async (req, res) => { 
    const allListings=await Listing.find({});
    res.render('listing/index.ejs',{allListings});
     
   }));
   
   //new listing route
   router.get("/new",wrapAsync(async (req,res)=>{
     res.render("listing/new.ejs");
   })) ;
   
   //create new listing route 
   //using the wrapAsync function to handle the error from the database
   //and using the validateListing function to validate the data we get from the form
   router.post("/", validateListing, wrapAsync(async (req, res) => {
     const listingData = req.body.listing || req.body;//this is to get the data from the form 
     const newListing = new Listing(listingData);
     await newListing.save();
     res.redirect("/listings");
   }));
   
   
   //show listing route
   router.get("/:id",wrapAsync(  async (req,res)=>{
       const {id}=req.params;//taking id from the url
       const listing=await Listing.findById(id).populate("reviews");
       //console.log(listing);//finding the listing by id
      res.render("listing/show.ejs",{listing});//rendering the view
       })) ;
   
   //edit listing route
   router.get("/:id/edit",wrapAsync(   async (req,res)=>{
     const {id}=req.params;
     
     const listing=await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});
           }));
   
   
   // update listing route
   
   router.put("/:id",wrapAsync(async (req, res) => {
     if(!req.body){//our custom message for invalid data 
       throw new ExpressError("Send a valid data for listing",400);
     }
     
     const { id } = req.params;//taking id from the url
     console.log(req.body);
     // Handle image update
     if (req.body.image) {
       if (typeof req.body.image === 'string') {
         // If image is a string, assume it's the URL
         req.body.image = { url: req.body.image, filename: 'ListingImage' };
       }
     }
   
     //runValidators is to validate the data before updating it in the database 
     //new:true is to return the updated listing
     //validateListing is to validate the data before updating it in the database 
    try{
       const listing = await Listing.findByIdAndUpdate(id, req.body, { new: true,runValidators:true });
       res.redirect(`/listings/${id}`);
     } catch (error) {
       console.error("Error updating listing:", error);
       res.status(500).send("Error updating listing");
     }
   }));
   
   //delete listing route
   router.delete("/:id",wrapAsync(  async(req,res)=>{
     const {id}=req.params;//taking id from the url
     const deletedListing= await Listing.findByIdAndDelete(id);//deleting the listing by id
     console.log(deletedListing);//logging the deleted listing
     res.redirect("/listings");
   })) ; 
   

   module.exports=router;