const mongoose=require('mongoose');
const initDB=require("./data.js");
const Listing=require('../models/listing');

main().then((res)=>{
    console.log("Connected Successfully");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const intitDB=async ()=>{
    
    await Listing.insertMany(initDB.data);
    console.log("data inserted");
    
}

intitDB();
