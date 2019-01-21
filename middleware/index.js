var Campground = require("../model/campground");
var Comment = require("../model/comment");
var middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } 
    req.flash("error", "You need to be Logged In to do that!")
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                console.log(err);
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
                var commentUserId = foundComment.author.id;
                if (commentUserId) {
                    if (commentUserId.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("back");
                    }
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be Logged In to do that!")
        res.redirect("back");
    }
}

middlewareObj.checkCampOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCamp) => {
            if (err) {
                console.log(err);
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                var campUserId = foundCamp.author.id;
                if (campUserId) {
                    if (campUserId.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("/campgrounds/" + req.params.id);
                    }
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You need to be Logged In to do that!")
        res.redirect("back");
    }
}

module.exports = middlewareObj;