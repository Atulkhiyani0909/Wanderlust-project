const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReviewData=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    newReview.author=req.user._id;//to store that the current user is the author of that review
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review created !!!");
    res.redirect(`/listings/${req.params.id}`); 
    };


    module.exports.destroyReview=async (req, res) => {
        let { id, reviewID } = req.params; // Ensure 'id' is the listing ID and 'reviewID' is the review ID
        console.log(id, reviewID);
        
        // First, find the listing to ensure it exists
        const listing = await Listing.findById(id);
       
    
        // Remove the review ID from the listing's reviews array
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
        
        // Delete the review
        let result = await Review.findByIdAndDelete(reviewID);
        
    
        console.log(result);
        req.flash("success","Review Deleted !!!");
        res.redirect(`/listings/${id}`);
    };