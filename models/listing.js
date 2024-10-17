const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review=require('./review.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true // This is the correct way to make a field required
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Object,
        required: true,
        url: String,
        filename: String
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref: 'Review'
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});
//added owner to listings to authorization

//this is the middleware post which is used to delete the reviews also when that listing has been deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      let res=await Review.deleteMany({_id:{$in:listing.reviews}});
      console.log(res);
    }
  });
  

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;