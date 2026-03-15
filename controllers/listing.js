const Listing = require("../models/listing.js");
const { cloudinary } = require("../cloudinary.js");
const { Readable } = require("stream");

// Index
module.exports.index = async (req, res) => {
    let allListing = await Listing.find({});
    res.render("./listing/index.ejs", { allListing });
};

// New form
module.exports.createListingForm = async (req, res) => {
    res.render("listing/new.ejs");
};

// Create listing with Cloudinary upload
module.exports.createListing = async (req, res, next) => {
    try {
        let newListing = new Listing(req.body.Listing);
        newListing.owner = req.user._id;

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "listings" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                Readable.from(req.file.buffer).pipe(stream);
            });

            newListing.image = {
                url: result.secure_url,
                filename: result.public_id   // Cloudinary का public_id filename की तरह save
            };
        }

        await newListing.save();
        req.flash("success", "New listing created");
        res.redirect("/Listings");
    } catch (err) {
        next(err);
    }
};

// Show listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/Listings");
    }
    res.render("listing/show.ejs", { listing });
};

// Edit form
module.exports.listingEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
};

module.exports.listingUpdate = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing }, { new: true });

    if (req.file) {
      if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder:  "listings" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(req.file.buffer).pipe(stream);
      });

      listing.image = {
        url: result.secure_url,
        filename: result.public_id
      };
      await listing.save();
    }

    req.flash("success", "Listing updated");
    res.redirect(`/Listings/${id}`);
  } catch (err) {
    next(err);
  }
};


// Delete listing (Cloudinary से भी image हटाना)
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
    }

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/Listings");
};
