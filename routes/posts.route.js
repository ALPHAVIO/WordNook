// this file contains post and search related stuff
const express = require("express");
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const auth = require("../middlewares/auth");
const Blog = require('./../models/Blog.model')


router.get(["/posts/:postName", "/page/posts/:postName", "/page/:page/posts/:postName", "/search/:query/posts/:postName", "/search/:query/:page/posts/:postName"], auth, function (req, res) {
    const user = req.user;
    let isAuthor = false;
    const requestedTitle = _.lowerCase(req.params.postName);
    Blog.find({}, function (err, posts) {
      if (!err) {
        posts.forEach(function (post) {
          const storedTitle = _.lowerCase(post.blogTitle);
          if (storedTitle === requestedTitle) {
            // Check if the user and author of this post are same
            if (user && JSON.stringify(user._id) === JSON.stringify(post.author)) {
              isAuthor = true;
            }
            //Sort the comments to show the recent one
            post.comments = post.comments.sort((a, b) => ((a.timestamps > b.timestamps) ? -1 : ((a.timestamps < b.timestamps) ? 1 : 0)));
            res.render("post", {
              title: post.blogTitle,
              content: post.blogContent,
              id: post._id,
              comments: post.comments,
              isAuthor,
              isAuthenticated: user ? true : false
            });
          }
        });
      }
      else {
        console.log(err);
      }
    });
  });
  
  //Post request to create a comment
  router.post("/posts/:postName/comment", async function (req, res) {
    const { name, content } = req.body;
    //Server side form validation
    if (name === "" || content === "") {
      res.redirect(`/posts/${req.params.postName}`);
    }
    else {
      const doc = await Blog.findOne({ blogTitle: req.params.postName });
      doc.comments.push({
        'name': name,
        'content': content,
        'timestamps': Math.floor(Date.now() / 1000)
      });
  
      await Blog.updateOne({ blogTitle: req.params.postName }, { comments: doc.comments }, function (err, doc) {
        if (err)
          console.log(err);
      })
      res.redirect(`/posts/${req.params.postName}`);
    }
  });
  
  //Post request to search by title
  router.post(["/search"], auth, function (req, res) {
    const query = req.body.query || req.params.query;
    var perPage = 5;
    const currentPage = req.params.page || 1;
  
    Blog.find({ blogTitle: { "$regex": query, "$options": "i" } })
      .skip((perPage * currentPage) - perPage)
      .sort({ 'timestamps': 'desc' })
      .limit(perPage)
      .exec(function (err, posts) {
        Blog.countDocuments({ blogTitle: { "$regex": query, "$options": "i" } }, function (err, count) {
          res.render("home", {
            homeStartingContent: homeStartingContent,
            posts: posts,
            current: currentPage,
            pages: Math.ceil(count / perPage),
            search: query,
            perPage: perPage,
            order: 'new one first',
            isAuthenticated: req.user ? true : false
          });
        })
  
      })
  })
  
  // GET request for search to support pagination
  router.get(["/search/:query/:page", "/search/:query", "/search/:query/:page/:perPage", "/search/:query"], auth, function (req, res) {
    const query = req.params.query;
    var perPage = parseInt(req.params.perPage) || 5;
    if (req.query.perPage > 0)
      perPage = parseInt(req.query.perPage);
    const order = req.query.order || "new one first";
    const currentPage = req.params.page || 1;
  
    Blog.find({ blogTitle: { "$regex": query, "$options": "i" } })
      .sort({ 'timestamps': (order === "new one first") ? 'desc' : 'asc' })
      .skip((perPage * currentPage) - perPage)
      .limit(perPage)
      .exec(function (err, posts) {
        Blog.countDocuments({ blogTitle: { "$regex": query, "$options": "i" } }, function (err, count) {
          res.render("home", {
            homeStartingContent: homeStartingContent,
            posts: posts,
            current: currentPage,
            pages: Math.ceil(count / perPage),
            search: query,
            perPage: perPage,
            order: order,
            isAuthenticated: req.user ? true : false
          });
        })
  
      })
  })
  
  //delete post route
  router.post('/posts/:postName', auth, (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).redirect("/log-in");
    }
  
    const requestedTitle = req.params.postName;
    console.log(requestedTitle)
    Blog.deleteOne({ blogTitle: requestedTitle, author: user._id }).then(
      () => {
        res.redirect("/");
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });

  module.exports = router