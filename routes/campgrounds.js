var express = require("express"),
    router  = express.Router(),
    Campground = require("../model/campground");

router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user});
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

router.get("/campgrounds/:id/edit", checkCampOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCamp) => {
        res.render("campgrounds/edit", {camp: foundCamp});
    });
});

router.put("/campgrounds/:id", checkCampOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.upd, (err, camp) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id); 
        }
    });
});

router.delete("/campgrounds/:id", checkCampOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/login");
}

function checkCampOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCamp) => {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                var campUserId = foundCamp.author.id;
                if (campUserId) {
                    if (campUserId.equals(req.user._id)) {
                        next();
                    }
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        // res.render("error", {errMsg: "You need to be logged in to EDIT camp."});
        res.redirect("back");
    }
}

module.exports = router;