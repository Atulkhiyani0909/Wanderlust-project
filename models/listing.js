const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const listings=new Schema({
    title:{
       type:String,
       required:true,
    },

    description:{
        type:String,
    },
    image:{
        filename:String,
        url:String,
    },
    price:Number,
    location:String,

    country:String,
});

const Listing=mongoose.model("Listing",listings);
module.exports=Listing;