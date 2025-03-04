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
        let originalImage=listing.image.url;
        originalImage=originalImage.replace("/uploads","/upload/w_250");
       res.render("listing/edit.ejs",{listing,originalImage});
};


module.exports.createListingdata=async (req, res) => {
    //this is to get the data from the form 
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(req.body);
    const newListing = new Listing(req.body);//form data in the req.body
    console.log(req.body);
    newListing.owner=req.user._id;//this is used to store the current user id in the listing owner 
    newListing.image={url,filename};//saving the img url 
    
    await newListing.save();
    req.flash("success","New listing created !!!");
    res.redirect("/listings");
  };


  module.exports.updateListingData=async (req, res) => {
    let {id}=req.params;
     let listing=await Listing.findByIdAndUpdate(id,{...req.body});
     
     

     //if the updated file exists then only to perform these tasks
     if(typeof req.file !=="undefined"){
      let url=req.file.path;
     let filename=req.file.filename;
     listing.image={ url , filename };
     await listing.save();
     }
     
     req.flash("success","Listing Updated Successfully !!");
     res.redirect(`/listings/${id}`);

    };


  module.exports.destroyListing=  async(req,res)=>{
    const {id}=req.params;//taking id from the url
    const deletedListing= await Listing.findByIdAndDelete(id);//deleting the listing by id
    console.log(deletedListing);//logging the deleted listing
    req.flash("success","Listing Deleted Successfully !!!");
    res.redirect("/listings");
  };