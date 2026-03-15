const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Memory storage so file buffer directly available
// ✅ Memory storage (no local disk)
const storage = multer.memoryStorage();
 const upload = multer({ storage });

module.exports = {cloudinary,upload};
