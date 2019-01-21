var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./model/campground"),
    Comment    = require("./model/comment"),
    User       = require("./model/user"),
    seedDB     = require("./seeds"),
    passport   = require("passport"),
    LocalStrat = require("passport-local"),
    MongoStrat = require("passport-local-mongoose"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash");

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    authRoutes       = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Clean DB and fill it with stored data.
seedDB();

// Passport configuration
app.use(require("express-session")({
    secret: "Neural Net",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errMsg = req.flash("error");
    res.locals.successMsg = req.flash("success");
    next();
});

app.use(authRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(3000, function() {
    console.log("App started on 3000 port.");
});