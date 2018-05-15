var Article = require("../models/articles.js");
var Comment = require("../models/comments.js");
var middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
};

middlewareObj.checkArticleOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Article.findById(req.params.id, function(err, foundArticle) {
			if (err) {
				req.flash("error", "Article not found");
				res.redirect("back");
			} else {
				// does the user own the campground
				if (foundArticle.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You do not have access to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				// does the user own the comment
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You do not have access to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You do not have access to do that");
		res.redirect("back");
	}
};

module.exports = middlewareObj;