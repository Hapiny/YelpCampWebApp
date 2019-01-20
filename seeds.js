var mongoose = require("mongoose");
var Campground = require("./model/campground");
var Comment = require("./model/comment")

data = [
    {
        name: "Easy Mountain", 
        image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg", 
        description: "This is good place to relax and enjoy Easy Mountain."
    },
    {
        name: "Wild Russian Camp", 
        image: "http://africatravelblogs.com/wp-content/uploads/2015/09/Forest-Camp.jpg", 
        description: "This camp is located in Taiga, wild russian territory with crazy bears and vodka."
    },
    {
        name: "Riboka Camp", 
        image: "https://www.wildernesstravel.com/images/hotels/africa/tanzania/serengeti-kilimanjaro-mountain-camping/serengeti-kilimanjaro-mountain-camping-01.jpg", 
        description: "Here you can often watch stargazing."
    },
    {
        name: "Greenland Campground", 
        image: "https://www.thetravelspecialists.net.au/wp-content/uploads/2017/09/Snow-Camping-SS_560726806.jpg", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Glencoe Camp", 
        image: "https://www.mountainphotography.com/images/xl/20080321-Needles-Winter-Camp.jpg", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
];

function seedDB() {
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("all campgrounds was removed.");
            data.forEach(camp => {
                Campground.create(camp, function(err, newCamp) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added new campground.");
                        // console.log(newCamp);
//                         Comment.create({
//                             text: "Test message",
//                             author: "Test user NSFW"
//                         }, (err, newComment) => {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 console.log("added new comment.");
//                                 newCamp.comments.push(newComment);
//                                 newCamp.save();
//                                 // console.log(newComment);
// 1                            }
//                         });
                    }

                }) 
            });
        }
    });
}

module.exports = seedDB;