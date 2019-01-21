var express = require("express"),
    router  = express.Router(),
    Campground = require("../model/campground"),
    Comment = require("../model/comment"),
    middleware = require("../middleware");

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {camp: foundCamp});
        }
    });
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("ADDED NEW COMMENT:");
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    console.log(comment);
                    foundCamp.comments.push(comment);
                    foundCamp.save();                    
                    res.redirect("/campgrounds/" + foundCamp._id);
                }
            });
        }
    });
});

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            console.log(err);
            res.redirect("bcak");
        } else {
            res.render("comments/edit", {camp_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;