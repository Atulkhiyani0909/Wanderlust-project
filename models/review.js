const mongoose=require('mongoose');
const Schema=mongoose.Schema;


//we are making the review for each listings 
//we are using one to many relationship because each listing can have multiple reviews
const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
       type:Schema.Types.ObjectId,
       ref:"User",
    }
});


module.exports=mongoose.model("Review",reviewSchema);