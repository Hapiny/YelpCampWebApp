var express = require("express"),
    router  = express.Router(),
    Campground = require("../model/campground");

router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, curUser: req.user});
        }
    });
});

router.post("/campgrounds", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCamp = {name: name, image: image, description: desc};
    Campground.create(newCamp, function(err, camp) {
        if (err) {
            console.log(err);
        } else {
            console.log("ADDED NEW CAMPGROUND:");
            var author = {
                id: req.user._id, 
                username: req.user.username
            };
            camp.author = author;
            camp.save();
            console.log(camp);
        }
    });
    res.redirect("/campgrounds");
});

router.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {camp: foundCamp});
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;