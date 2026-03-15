const Listing=require("./models/listing.js")
const Review=require("./models/review.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")

module.exports.isLogedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){ // current session me user store hai 
      req.session.redirecUrl=req.originalUrl
    req.flash("error","you must login the page")
    return res.redirect("/login")
  }
  next();
}
// passport login ke baad session ko reset kar deta hai 
// original url ko local me dtore karayege in the form middleware
module.exports.saveUrl=(req,res, next)=>{
  if(req.session.redirecUrl){
    res.locals.redirectUrl=req.session.redirecUrl;
  }
  next();
}

// authorization 
module.exports.isOwner=async(req,res,next)=>{
   let{id} = req.params
    let listing=await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of this listing")
      return res.redirect(`/Listings/${id}`)
    }
    next()
}
// agar koi bhi galat info likha jata hai to error show karega 
// ise new listing and update listing karne me kaam aayega 
// ye ek middleware hai 
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    return res.status(400).send(msg);
  } else {
    next();
  }
}
// review validating function
module.exports.validateReview =(req,res,next)=>{
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const msg= error.details.map(el=>el.message).join(",")
        return res.status(400).send(msg)
    }else{
        next()
    }
}
module.exports.isReviewAuthor=async(req,res,next)=>{
   let{id,reviewId} = req.params
    let review=await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of this listing")
      return res.redirect(`/Listings/${id}`)
    }
    next()
}