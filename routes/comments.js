var express = require("express");
var router = express.Router({ mergeParams: true });
var middleware = require("../middleware");
var Comment = require("../models/comments.js");
var Article = require("../models/articles.js");
// ===================
// new comments route
// ===================
router.get("/new", middleware.isLoggedIn, function (req, res) {
  Article.findById(req.params.id, function (err, foundArticle) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { article: foundArticle });
    }
  });
});
// ===================
// create comments route
// ===================
router.post("/", middleware.isLoggedIn, function (req, res) {
  Article.findById(req.params.id, function (err, foundArticle) {
    if (err) {
      console.log(err);
      res.redirect("/articles");
    } else {
      Comment.create(req.body.comments, function (err, comment) {
        if (err) {
          req.flash("error", "Sorry, something went wrong");
          console.log(err);
        } else {
          // add id and ussername to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          foundArticle.comments.push(comment._id);
          foundArticle.save();
          console.log(req.user);
          console.log(comment);
          req.flash(
            "success",
            "Successfully added! Thank you for your comment!"
          );
          res.redirect("/articles/" + foundArticle._id);
        }
      });
    }
  });
});
// edit comments
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/articles/" + req.params.id, {
          article_id: req.params.id,
          comment: { ...foundComment, edit_mode: true },
        });
        // res.render("comments/edit", {
        //   article_id: req.params.id,
        //   comment: foundComment,
        // });
      }
    });
  }
);
// update comment
router.put(
  "/:comment_id",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comments,
      function (err, updatedComment) {
        if (err) {
          res.redirect("back");
        } else {
          req.flash("success", "Comment updated");
          res.redirect("/articles/" + req.params.id);
        }
      }
    );
  }
);

// delete comment
router.delete(
  "/:comment_id",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
      if (err) {
        res.redirect("back");
      } else {
        req.flash("success", "Comment successfully deleted");
        res.redirect("/articles/" + req.params.id);
      }
    });
  }
);

module.exports = router;
