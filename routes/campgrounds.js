var express = require("express"),
    router  = express.Router(),
    Campground = require("../model/campground"),
    middleware = require("../middleware");

router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user});
        }
    });
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var newCamp = {name: name, image: image, description: desc, price: price};
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
            req.flash("success", "You successfully added new Camp!");
            console.log(camp);
        }
    });
    res.redirect("/campgrounds");
});

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
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

router.get("/campgrounds/:id/edit", middleware.checkCampOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCamp) => {
        res.render("campgrounds/edit", {camp: foundCamp});
    });
});

router.put("/campgrounds/:id", middleware.checkCampOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.upd, (err, camp) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "You successfully updated Campground");
            res.redirect("/campgrounds/" + req.params.id); 
        }
    });
});

router.delete("/campgrounds/:id", middleware.checkCampOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "You successfully deleted Campground");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;