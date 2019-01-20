var mongoose = require("mongoose");

var commentScheme = mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model("Comment", commentScheme);