var mongoose = require("mongoose");
var mongoPassport = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(mongoPassport);
module.exports = mongoose.model("User", userSchema);