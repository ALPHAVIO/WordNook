// requiring dependencies, models and middlewares
const express = require("express");
const auth = require("../middlewares/auth");
const Blog = require("../models/Blog.model");

const router = express.Router();

//Default Texts-
const homeStartingContent =
  "I'm Daily Journal, your best pal. What do I do? Well, I'm here to help you out. I'll be there to listen to your thoughts or share with you my pal's ideas and few amazing blogs.That's all? Not yet. I'm here to take you on a wonderful journey of unlimited thoughts and help you find your twin souls too!!! Sounds great? Here we go....Let's get started.";
const aboutContent =
  "'Blog' and 'blogging' are now loosely used for content creation and sharing on social media, especially when the content is long-form and one creates and shares content on regular basis.";
const contactContent =
  "Got a query to ask? Have an amazing idea? Loved our page? Okay! All you have to do is shoot a mail and we'll get back to you shortly.";

//Get request for home route-
router.get(
  ["/", "/page/:page", "/page/:perPage", "/page/:page/:perPage"],
  auth,
  function (req, res) {
    var perPage = parseInt(req.params.perPage) || 5;
    if (req.query.perPage > 0) perPage = parseInt(req.query.perPage);
    const currentPage = req.params.page || 1;
    const order = req.query.order || "new one first";
    Blog.find({})
      .sort({ timestamps: order === "new one first" ? "desc" : "asc" })
      .skip(perPage * currentPage - perPage)
      .limit(perPage)
      .exec(function (err, foundBlogs) {
        Blog.count().exec(function (err, count) {
          if (err) console.log(err);
          else {
            res.render("home", {
              homeStartingContent: homeStartingContent,
              posts: foundBlogs,
              current: currentPage,
              pages: Math.ceil(count / perPage),
              search: "",
              perPage: perPage,
              order: order,
              isAuthenticated: req.user ? true : false,
              // currentUser: req.user,
            });
          }
        });
      });
  }
);

//Get request for about page-
router.get("/about", auth, function (req, res) {
  res.render("about", {
    aboutContent: aboutContent,
    isAuthenticated: req.user ? true : false,
  });
});

//Get request for contact page-
router.get("/contact", auth, function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
    error: "",
    formData: {
      subject: "",
      email: "",
      message: "",
    },
    isAuthenticated: req.user ? true : false,
  });
});

//post request for contact page
router.post("/contact", (req, res) => {
  //requiring api for mailgun
  const sendMail = require("../mail");

  const { subject, email, message } = req.body;
  sendMail(subject, email, message, (err, data) => {
    if (err) res.status(500).json({ message: "Error occurred!" });
    else {
      res.render("contact", {
        contactContent: "Email was sent successfully!",
        error: "",
        formData: {
          subject: "",
          email: "",
          message: "",
        },
        isAuthenticated: req.user ? true : false,
      });
    }
  });
});

//Get request for compose blog page-
router.get("/compose", auth, function (req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).redirect("/log-in");
  }
  res.render("compose", {
    isAuthenticated: true,
  });
});

//Post request to save the new blogs to the DB
router.post("/compose", auth, function (req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).redirect("/log-in");
  }
  const postTitle = req.body.postTitle;
  const postContent = req.body.postBody;
  const blog = new Blog({
    blogTitle: postTitle,
    blogContent: postContent,
    comments: [],
    author: user._id,
  });
  blog.save();
  res.redirect("/");
});

module.exports = router;
