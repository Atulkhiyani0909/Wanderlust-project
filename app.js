//this is used as we want our key only in development phase not in the production phase  when we deploy our project because this is the confidential information
if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose=require('mongoose');
const Listing=require('./models/listing');
const port = 8080;
const path=require('path');
const method=require('method-override');
const ejsMate=require('ejs-mate');

const flash=require('connect-flash');


const session=require('express-session');
const MongoStore=require('connect-mongo');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');




const dburl=process.env.ATLASDB_URL;

//MongoSession to store the data in online server

const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:"mysecreteoption",
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("Error in MongoSEssion Store ",err);
})

//session 
const sessionOptions={
  store,
  secret:"mysecreteoption",
  resave:false,
  saveUnintialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,//in millisecond this is about seven days
    maxAge:7*24*60*60*1000,
    httpOnly:true,//to save from the cross scripting attack
  }
}

//using sessions in our project we can confirm by checking it in the inspect cookies we wil see that there is the cookie_sid by which we can cofirm that sessions are being used

app.use(session(sessionOptions));
app.use(flash());//using for popup message


//using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//use add local authenticate method in local strategy 

//means that it serialize the user means it stores the user info when there is the  session for the user so user doesn;t want to login again and again and when the sessions overs it info gets deleted from the sessions 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for message;
app.use((req,res,next)=>{
  res.locals.successMsg=req.flash('success');
  res.locals.errorMsg=req.flash('error');
  res.locals.currUser=req.user;//to store the info of the current user
  next();
});


//requireing listings routes
const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const profileRouter=require("./routes/profile.js");


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


// app.get("/demouser",async (req,res)=>{
// let fakeuser= new User({
// email:"rohan@getMaxListeners.com",
// username:"delta"
// });

// // we have written only email in our schema but we are using the usename and password here because passport add's the username and password by default to the it.

// let userregistered=await User.register(fakeuser,"@helloduniya");//this register  logic is already wriiten by the passport and we don;t need to do anything @helloduniya is our password 

// res.send(userregistered);
// });




//for using the listing & reviews routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
app.use("/user",profileRouter);




//this is to connect to the database
main().then((res)=>{
    console.log("Connected Successfully");
}).catch(err => console.log(err));

async function main() {
  //now our data is in online db
  await mongoose.connect(dburl);

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


