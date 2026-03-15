const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// agar default property ho to usse lo
const plugin = passportLocalMongoose.default || passportLocalMongoose;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

// plugin attach karo
userSchema.plugin(plugin);

module.exports = mongoose.model("User", userSchema);
