const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review= require("./review");
const { ref } = require("joi");
const User =require("./user")
const ListingSchema = new Schema({
    title: {
        type: String,
    },
    description: String,
    price: Number,
    image: {
        url:String,
        filename: String
    },
    location: String,
    country: String,
    reviews :[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type : Schema.Types.ObjectId,
        ref : "User"
    },
})
//mongoose middleware
ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})
const Listing = mongoose.model("Listing", ListingSchema)
module.exports = Listing