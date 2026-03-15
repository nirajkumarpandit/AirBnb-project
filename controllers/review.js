const Review=require("../models/review.js")
const Listing = require("../models/listing.js")

module.exports.createReview = async(req,res)=>{
    // Find listing by ID
     let listing = await Listing.findById(req.params.id);

    // Create new review from form data
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id //add author in review
    await newReview.save();
    // Push review reference into listing
    listing.reviews.push(newReview._id);

    // Save listing with updated reviews
    await listing.save();
    req.flash("success","Review Created!")
     res.redirect(`/Listings/${listing._id}`);
}
module.exports.destroyReview =async(req,res)=>{
    // find the id and reviewId from body
    let{id,reviewId}=req.params
    // 
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted!")
    res.redirect(`/Listings/${id}`)
}