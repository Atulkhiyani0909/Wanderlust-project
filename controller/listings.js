const Listing=require("../models/listing");

module.exports.index=async (req, res) => { 
    const allListings=await Listing.find({});
    res.render('listing/index.ejs',{allListings});
     
};


module.exports.renderNewForm=async (req,res)=>{
    //isLogedIN as middleware to check whether user is loged in or not 
     res.render("listing/new.ejs");
   };

module.exports.showListings=async (req,res)=>{
    const {id}=req.params;//taking id from the url

    //we are using here nested populate as when we are populating the reviews than we are populating the author in reviews
    const listing=await Listing.findById(id).populate({
     path:"reviews",
     populate:{
       path:"author",
     },
    }).populate("owner");//,populate to get the reviews of that listing also 

    //console.log(listing);//finding the listing by id
    if(!listing){
     req.flash("error","Listing you requested doesn't exists");
     res.redirect("/listings");
    }
    console.log(listing);
    res.render("listing/show.ejs",{listing});//rendering the view
    };


    module.exports.editListingForm=  async (req,res)=>{
        const {id}=req.params;
        const listing=await Listing.findById(id);
        if(!listing){
         req.flash("error","Listing you requested doesn't exists");
         res.redirect("/listings");
        }
       res.render("listing/edit.ejs",{listing});
};


module.exports.createListingdata=async (req, res) => {
    //this is to get the data from the form 
    console.log(req.body);
    const newListing = new Listing(req.body);//form data in the req.body
    
    newListing.owner=req.user._id;//this is used to store the current user id in the listing owner 
    await newListing.save();
    req.flash("success","New listing created !!!");
    res.redirect("/listings");
  };


  module.exports.updateListingData=async (req, res) => {
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
      req.flash("success","Listing Updated !!!");
      res.redirect(`/listings/${id}`);
    } catch (error) {
      req.flash("error","Error updating the listing");
      res.status(500).send("Error updating listing");
    }
  };


  module.exports.destroyListing=  async(req,res)=>{
    const {id}=req.params;//taking id from the url
    const deletedListing= await Listing.findByIdAndDelete(id);//deleting the listing by id
    console.log(deletedListing);//logging the deleted listing
    req.flash("success","Listing Deleted Successfully !!!");
    res.redirect("/listings");
  };