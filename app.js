if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

const express=require("express")
const app=express();
const mongoose=require("mongoose")
const path=require("path")
const Listing=require("./models/listing.js")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const wrapAsync= require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js") // for server side validation using joi schema
const Review=require("./models/review.js")
// router ko require kiya hai
const listingRouter= require("./routes/listing.js")
const reviewRouter =require("./routes/review.js")
const userRouter =require("./routes/user.js")
const session =require("express-session")
const MongoStore = require('connect-mongo').default;
const flash=require("connect-flash")
const passport = require("passport");
 const LocalStrategy = require("passport-local");
  const User = require("./models/user");

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

main().then((res)=>{
    console.log("database connected")
}).catch((err)=>{
    console.log(err)
})
async function main() {
   await mongoose.connect(process.env.MONGO_URL);
}

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR", err);
});
let sessionOptions ={
    secret :process.env.SECRET,
    resave : false,
    saveUninitialized: true,
    store:store,
    cookie :{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge :7*24*60*60*1000,
        httpOnly : true
    }
}


app.use(session(sessionOptions))
app.use(flash())

// authentication 

// initialize passport
app.use(passport.initialize());
app.use(passport.session());
// LocalStrategy setup
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next()
})

// ye router ke liye hai 
app.use("/Listings",listingRouter) // /Listings ke jagah per listiings ka use karo
app.use('/Listings/:id/reviews',reviewRouter)
app.use("/",userRouter)

// age kkoi rout nahi milta ahi to page not found ka middleware
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
})
// middleware for handdle err
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err  // jo error aaya page se uase nikalo ( ye default message hai)
    res.render("listing/error.ejs",{message})
    // res.status(statusCode).send(message) // phir send kar do message
})



app.listen(8000,()=>{
    console.log(`server listening on ${8000}...`)
})