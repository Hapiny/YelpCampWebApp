var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./model/campground");


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: campgrounds} );
        }
    });
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCamp = {name: name, image: image, description: desc};
    Campground.create(newCamp, function(err, camp) {
        if (err) {
            console.log(err);
        } else {
            console.log("ADDED NEW CAMPGROUND:");
            console.log(newCamp);
        }
    });
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {camp: foundCamp});
        }
    });
});

app.listen(3000, function() {
    console.log("App started on 3000 port.");
});