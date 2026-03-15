const express = require("express")
const router = express.Router()
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const { isLogedIn, isOwner, validateListing } = require("../middleware.js")
const { populate } = require("../models/review.js")
const listingControllers = require("../controllers/listing.js")
// upload file
const { cloudinary, upload } = require("../cloudinary.js");

router.get("/", wrapAsync(listingControllers.index))
// form render for create new listing
router.get("/new", isLogedIn, wrapAsync(listingControllers.createListingForm))
// create route
router.post("/", isLogedIn , upload.single("Listing[image]"), validateListing, wrapAsync(listingControllers.createListing))


// show route
router.get("/:id", wrapAsync(listingControllers.showListing))

// update route
router.get("/:id/edit", isLogedIn, isOwner, validateListing, wrapAsync(listingControllers.listingEditForm))
router.put("/:id", isLogedIn, isOwner,upload.single("Listing[image]"), wrapAsync(listingControllers.listingUpdate))
// delete 
router.delete("/:id", isLogedIn, isOwner, wrapAsync(listingControllers.destroyListing))

module.exports = router