const express = require('express');
const app = express();
const mongoose=require('mongoose');
const Listing=require('./models/listing');
const port = 8080;
const path=require('path');
const method=require('method-override');
const ejsMate=require('ejs-mate');

const flash=require('connect-flash');

//session 
const session=require('express-session');

const sessionOptions={
  secret:"mysecreteoption",
  resave:false,
  saveUnintialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
}


//using sessions in our project we can confirm by checking it in the inspect cookies we wil see that there is the cookie_sid by which we can cofirm that sessions are being used

app.use(session(sessionOptions));
app.use(flash());//using for popup message


//for message;
app.use((req,res,next)=>{
  res.locals.successMsg=req.flash('success');
  res.locals.errorMsg=req.flash('error');
  next();
});


//requireing listings routes
const listings=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");

//importing the listingSchema from the schema.js file
//using joi for the validation of the data 
const {listingSchema,reviewSchema}=require('./schema.js');
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


//for using the listing routes
app.use("/listings",listings);


app.use("/listings/:id/reviews",reviews);

//this is to connect to the database
main().then((res)=>{
    console.log("Connected Successfully");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}







//listing routes
//in /routes/listing.js


//all reviews routes 
//in /routes/reviews.js




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


