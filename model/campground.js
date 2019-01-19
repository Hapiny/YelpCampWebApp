var mongoose = require("mongoose");

var campgroundScheme = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
});

module.exports = mongoose.model("Campground", campgroundScheme);