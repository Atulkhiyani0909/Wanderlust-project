const express = require('express');
const app = express();
const mongoose=require('mongoose');
const Listing=require('./models/listing');
const port = 8080;
const path=require('path');
const method=require('method-override');
const ejsMate=require('ejs-mate');


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


//listing routes
app.get('/listings',async (req, res) => { 
 const allListings=await Listing.find({});
 res.render('listing/index.ejs',{allListings});
  
});

//new listing route
app.get("/listings/new",(req,res)=>{
  res.render("listing/new.ejs");
});

//create new listing route
app.post("/listings",async (req,res)=>{
  const newListing= req.body;
  console.log(newListing);
  await Listing.create(newListing);//creating a new listing and saving it to the database
  res.redirect("/listings");
});


//show listing route
app.get("/listings/:id",async (req,res)=>{
    const {id}=req.params;//taking id from the url
    const listing=await Listing.findById(id);
    console.log(listing);//finding the listing by id
   res.render("listing/show.ejs",{listing});//rendering the view
});

//edit listing route
app.get("/listings/:id/edit",async (req,res)=>{
  const {id}=req.params;
  const listing=await Listing.findById(id);
 res.render("listing/edit.ejs",{listing});
});


// update listing route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;//taking id from the url
  
  // Handle image update
  if (req.body.image) {
    if (typeof req.body.image === 'string') {
      // If image is a string, assume it's the URL
      req.body.image = { url: req.body.image, filename: 'ListingImage' };
    }
  }

  //runValidators is to validate the data before updating it in the database 
  //new:true is to return the updated listing
  try {
    const listing = await Listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    console.log(listing);
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).send("Error updating listing");
  }
});

//delete listing route
app.delete("/listings/:id", async(req,res)=>{
  const {id}=req.params;//taking id from the url
  const deletedListing= await Listing.findByIdAndDelete(id);//deleting the listing by id
  console.log(deletedListing);//logging the deleted listing
  res.redirect("/listings");
}); 


//error handling middleware for the server
app.use((err,req,res,next)=>{
  let {status=500,message="Internal Server Error"}=err;
  res.status(status).send(message);
});

app.listen(port,()=>{
    console.log(`App listining on port ${port}`);
});


