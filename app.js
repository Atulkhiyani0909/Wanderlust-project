const express = require('express');
const app = express();
const mongoose=require('mongoose');
const Listing=require('./models/listing');
const port = 8080;
const path=require('path');
const method=require('method-override');
const ejsMate=require('ejs-mate');


//importing the listingSchema from the schema.js file
//using joi for the validation of the data 
const {listingSchema}=require('./schema.js');
const Review=require("./models/review.js");


//importing the wrapAsync function
//that will handle the error from the database
const wrapAsync=require('./utils/wrapAsync');

//this is to handle the error from the database
//our own error class now we can custom the error 
const ExpressError=require('./utils/ExpressError');
const { Console } = require('console');


// this is for the views folder
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//this is to get the data from the form to read urlencoded
app.use(express.urlencoded({extended:true}));

//this is to use the method override
app.use(method('_method'));

//this is to use the ejs-mate
app.engine('ejs',ejsMate);

//this is to use the public folder
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));


//this is to connect to the database
main().then((res)=>{
    console.log("Connected Successfully");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



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





//listing routes
app.get('/listings',wrapAsync(async (req, res) => { 
 const allListings=await Listing.find({});
 res.render('listing/index.ejs',{allListings});
  
}));

//new listing route
app.get("/listings/new",wrapAsync(async (req,res)=>{
  res.render("listing/new.ejs");
})) ;

//create new listing route 
//using the wrapAsync function to handle the error from the database
//and using the validateListing function to validate the data we get from the form
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
  const listingData = req.body.listing || req.body;//this is to get the data from the form 
  const newListing = new Listing(listingData);
  await newListing.save();
  res.redirect("/listings");
}));


//show listing route
app.get("/listings/:id",wrapAsync(  async (req,res)=>{
    const {id}=req.params;//taking id from the url
    const listing=await Listing.findById(id);
    console.log(listing);//finding the listing by id
   res.render("listing/show.ejs",{listing});//rendering the view
    })) ;

//edit listing route
app.get("/listings/:id/edit",wrapAsync(   async (req,res)=>{
  const {id}=req.params;
  
  const listing=await Listing.findById(id);
 res.render("listing/edit.ejs",{listing});
        }));


// update listing route
app.put("/listings/:id",wrapAsync(async (req, res) => {
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
app.delete("/listings/:id",wrapAsync(  async(req,res)=>{
  const {id}=req.params;//taking id from the url
  const deletedListing= await Listing.findByIdAndDelete(id);//deleting the listing by id
  console.log(deletedListing);//logging the deleted listing
  res.redirect("/listings");
})) ; 



//Reviews 
//post route
app.post("/listings/:id/reviews",async (req,res)=>{
let listing=await Listing.findById(req.params.id);


let newReview=new Review(req.body.review);
console.log(req.body.review);

listing.reviews.push(newReview);
await newReview.save();
await listing.save();

res.send("reviews saved");
});





//if the request is not found to  the route define above 
//then this app.all will handle it and and we can send the custom error message
app.all('*',(req,res,next)=>{
  next(new ExpressError("Page Not Found",404));
});


//error handling middleware for the server
//handling the error form the DataBase 
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Internal Server Error"}=err;
  res.status(statusCode).render("error.ejs",{message,statusCode});
});

app.listen(port,()=>{
    console.log(`App listining on port ${port}`);
});


//now we have attach the wrapAsync function to the routes 
//so we don't need to use the try and catch block in the routes
//and we can handle the error in the wrapAsync function


