var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var Article = require("../models/articles.js");

// index route
router.get("/", function (req, res) {
  Article.find({}, function (err, allArticles) {
    if (err) {
      console.log(err);
    } else {
      res.render("articles/index", { articles: allArticles });
    }
  });
});

// create route
router.post("/", middleware.isLoggedIn, function (req, res) {
  var title = req.body.article.title;
  var image = req.body.article.image;
  var post = req.body.article.post;
  var author = {
    id: req.user._id,
    username: req.user.username,
    full_name: req.body.article.author.full_name,
  };
  var newArticle = { title: title, image: image, post: post, author: author };
  Article.create(newArticle, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      console.log(req.user);
      //redirect back to articles page
      req.flash("success", "Successfully created an article!");
      res.redirect("/articles");
    }
  });
});

// new route
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("articles/new");
});

// show route
router.get("/:id", function (req, res) {
  Article.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundArticle) {
      if (err) {
        console.log(err);
      } else {
        res.render("articles/show", { article: foundArticle });
      }
    });
});

// edit route
router.get("/:id/edit", middleware.checkArticleOwnership, function (req, res) {
  Article.findById(req.params.id, function (err, foundArticle) {
    res.render("articles/edit", { article: foundArticle });
  });
});

// update route
router.put("/:id", middleware.checkArticleOwnership, function (req, res) {
  Article.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.article.title,
      "author.full_name": req.body.article.author.full_name,
      image: req.body.article.image,
      post: req.body.article.post,
    },
    function (err, articleUpdate) {
      if (err) {
        console.log(err);
      } else {
        req.flash("success", "Your article was updated");
        res.redirect("/articles/" + req.params.id);
      }
    }
  );
});

//destroy route
router.delete("/:id", middleware.checkArticleOwnership, function (req, res) {
  Article.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.log(err);
    } else {
      req.flash("sucess", "Article succesfully deleted");
      res.redirect("/articles");
    }
  });
});

// ============
// search route
// ============
router.post("/search", function (req, res) {
  Article.find(
    {
      $or: [
        { title: { $regex: req.body.search, $options: "i" } },
        { author: { $regex: req.body.search, $options: "i" } },
      ],
    },
    function (err, matchingArticles) {
      if (err) {
        console.log(err);
      } else {
        res.render("searchResults", {
          articles: matchingArticles,
          search: req.body.search,
        });
      }
    }
  );
});

module.exports = router;
