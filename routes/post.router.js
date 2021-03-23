// requiring dependencies, models and middlewares
const express = require("express");
var _ = require("lodash");
const auth = require("../middlewares/auth");
const Blog = require("../models/Blog.model");

const router = express.Router();
const homeStartingContent =
  "I'm Daily Journal, your best pal. What do I do? Well, I'm here to help you out. I'll be there to listen to your thoughts or share with you my pal's ideas and few amazing blogs.That's all? Not yet. I'm here to take you on a wonderful journey of unlimited thoughts and help you find your twin souls too!!! Sounds great? Here we go....Let's get started.";

//Get request for posts page-
router.get(
  [
    "/posts/:postId",
    "/page/posts/:postId",
    "/page/:page/posts/:postId",
    "/search/:query/posts/:postId",
    "/search/:query/:page/posts/:postId",
  ],
  auth,
  function (req, res) {
    const user = req.user;
    let isAuthor = false;
    const requestedPostId = req.params.postId;
    Blog.findOne({ _id: requestedPostId }, function (err, post) {
      if (!err) {
        // Check if the user and author of this post are same
        if (user && JSON.stringify(user._id) === JSON.stringify(post.author)) {
          isAuthor = true;
        }
        //Sort the comments to show the recent one
        post.comments = post.comments.sort((a, b) =>
          a.timestamps > b.timestamps ? -1 : a.timestamps < b.timestamps ? 1 : 0
        );
        res.render("post", {
          title: post.blogTitle,
          content: post.blogContent,
          id: post._id,
          comments: post.comments,
          isAuthor,
          isAuthenticated: user ? true : false,
          currentUser: user,
        });
      } else {
        console.log(err);
      }
    });
  }
);

//Post request to create a comment
router.post("/posts/:postId/comment", auth, async function (req, res) {
  try {
    const loggedUser = req.user;
    const { content } = req.body;
    //check if the user is authenticated
    if (!loggedUser) {
      return res.status(401).redirect(req.baseUrl + "/sign-up");
    }
    //Server side form validation
    else if (content === "") {
      res.redirect(`/posts/${req.params.postId}`);
    } else {
      const doc = await Blog.findOne({ _id: req.params.postId });
      doc.comments.push({
        name: loggedUser.name,
        content: content,
        timestamps: Math.floor(Date.now() / 1000),
      });

      await Blog.updateOne(
        { _id: req.params.postId },
        { comments: doc.comments }
      );
      res.redirect(`/posts/${req.params.postId}`);
    }
  } catch (err) {
    if (err) console.log(err);
    return res.redirect("back");
  }
});

// Delete comment Route
router.post(
  "/posts/:postId/comments/:commentNum",
  auth,
  async function (req, res) {
    const isUser = req.user ? true : false;
    const requestedPostId = req.params.postId;
    const commentNum = req.params.commentNum;
    if (!isUser) {
      // checking if user is authenticated
      return res.status(401).redirect(req.baseUrl + "/sign-up");
    } else {
      const foundPost = await Blog.findOne({ _id: requestedPostId });
      foundPost.comments = foundPost.comments.sort((a, b) =>
        a.timestamps > b.timestamps ? -1 : a.timestamps < b.timestamps ? 1 : 0
      );
      foundPost.comments.splice(commentNum, 1);
      await Blog.updateOne(
        { _id: requestedPostId },
        { comments: foundPost.comments },
        function (err, foundPost) {
          if (err) console.log(err);
        }
      );
      res.redirect(`/posts/${requestedPostId}`);
    }
  }
);

//Post request to search by title
router.post(["/search"], auth, function (req, res) {
  const query = req.body.query || req.params.query;
  var perPage = 5;
  const currentPage = req.params.page || 1;

  Blog.find({ blogTitle: { $regex: query, $options: "i" } })
    .skip(perPage * currentPage - perPage)
    .sort({ timestamps: "desc" })
    .limit(perPage)
    .exec(function (err, posts) {
      Blog.countDocuments(
        { blogTitle: { $regex: query, $options: "i" } },
        function (err, count) {
          res.render("home", {
            homeStartingContent: homeStartingContent,
            posts: posts,
            current: currentPage,
            pages: Math.ceil(count / perPage),
            search: query,
            perPage: perPage,
            order: "new one first",
            isAuthenticated: req.user ? true : false,
          });
        }
      );
    });
});

// GET request for search to support pagination
router.get(
  [
    "/search/:query/:page",
    "/search/:query",
    "/search/:query/:page/:perPage",
    "/search/:query",
  ],
  auth,
  function (req, res) {
    const query = req.params.query;
    var perPage = parseInt(req.params.perPage) || 5;
    if (req.query.perPage > 0) perPage = parseInt(req.query.perPage);
    const order = req.query.order || "new one first";
    const currentPage = req.params.page || 1;

    Blog.find({ blogTitle: { $regex: query, $options: "i" } })
      .sort({ timestamps: order === "new one first" ? "desc" : "asc" })
      .skip(perPage * currentPage - perPage)
      .limit(perPage)
      .exec(function (err, posts) {
        Blog.countDocuments(
          { blogTitle: { $regex: query, $options: "i" } },
          function (err, count) {
            res.render("home", {
              homeStartingContent: homeStartingContent,
              posts: posts,
              current: currentPage,
              pages: Math.ceil(count / perPage),
              search: query,
              perPage: perPage,
              order: order,
              isAuthenticated: req.user ? true : false,
            });
          }
        );
      });
  }
);

//delete post route
router.post("/posts/:postId/delete", auth, (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).redirect("/log-in");
  }

  const requestedPostId = req.params.postId;
  // console.log(requestedPostId)
  Blog.deleteOne({ _id: requestedPostId, author: user._id })
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

router.post("/category", auth, async (req, res, next) => {
  const category = req.body.category;
  if (!category) {
    res.redirect("/");
  }
  let posts = await Blog.find({ category });
  res.render("category", {
    category,
    posts,
    isAuthenticated: req.user ? true : false,
  });
});

module.exports = router;
