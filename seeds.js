var mongoose = require("mongoose");
var Article = require("./models/articles");
var Comment   = require("./models/comments");

var data = [
    {
        title: "Cloud's Rest",
        author: "Rachel",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        post: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        RightOrLeft: "left"
    },
    {
        title: "Desert Mesa",
        author: "Robby",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        post: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        RightOrLeft: "left"
    },
    {
        title: "Canyon Floor",
        author: "Gracie",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        post: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        RightOrLeft: "right"
    }
];

function seedDB(){
   //Remove all campgrounds
   Article.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed articles!!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("Removed comments!");
             //add a few Articles
            data.forEach(function(seed){
                Article.create(seed, function(err, article){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Added a Article");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                name: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    article.comments.push(comment._id);
                                    article.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;
