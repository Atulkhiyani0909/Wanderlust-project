const Listing=require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");

module.exports.isLogedIN=(req,res,next)=>{

    if(!req.isAuthenticated()){//this is method given by the passport and this check in the session whether user is logged in or not 
   req.session.redirectUrl=req.originalUrl;
   console.log(req.session.redirectUrl);
      req.flash("error","You must be LoggedIn to Make Changes");
  return res.redirect("/login");
  }
  next();
}
 


//this middleware can store the last path where the user left it and after login it redirect the user to that path only this maintain the flow of the code to work smoothly 

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};
 

//to check the signin user is the owner of the listing to edit the listing info  
module.exports.isOwner=async (req,res,next)=>{
  let {id}=req.params;
  let listing =await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the Owner of this Listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}


//for the validation of the data
//using the joi for the validation
module.exports.validateListing= (req,res,next)=>{
  let {error} =listingSchema.validate(req.body);
  if(error){
    const msg=error.details.map(el=>el.message).join(',');
    throw new ExpressError(error.details[0].message,400);
  }
  next();
}