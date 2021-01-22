//jshint esversion:6

//Acquiring Dependencies- 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");
const dotenv = require('dotenv');

//Default Texts-
const homeStartingContent = "I'm Daily Journal, your best pal. What do I do? Well, I'm here to help you out. I'll be there to listen to your thoughts or share with you my pal's ideas and few amazing blogs.That's all? Not yet. I'm here to take you on a wonderful journey of unlimited thoughts and help you find your twin souls too!!! Sounds great? Here we go....Let's get started.";
const aboutContent = "'Blog' and 'blogging' are now loosely used for content creation and sharing on social media, especially when the content is long-form and one creates and shares content on regular basis.";
const contactContent = "Got a query to ask? Have an amazing idea? Loved our page? Okay! All you have to do is shoot a mail and we'll get back to you shortly.";

//Setting up the app and the ejs view engine-
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

dotenv.config({path:'./.env'})

//Connecting to Mongo Database using ODM Mongoose-
const URL = process.env.URL;
mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true});

//Setting up schema for the collection-
const blogSchema = {
  blogTitle: String,
  blogContent: String,
  comments: Array
}

//Making a MongoDB model for the schema-
const Blog = new mongoose.model("Blog", blogSchema);

//Get request for home route-
app.get("/", function(req, res){
  Blog.find({}, function(err, foundBlogs){
    if(!err){
      if(foundBlogs){
        res.render("home", {
          homeStartingContent: homeStartingContent,
          posts: foundBlogs,
        });
      }
    }
  });
});

//Get request for about page-
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

//Get request for contact page-
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

//Get request for compose blog page-
app.get("/compose", function(req, res){
  res.render("compose");
});

//Post request to save the new blogs to the DB
app.post("/compose", function(req, res){
  const postTitle = req.body.postTitle;
  const postContent = req.body.postBody;
  const blog = new Blog({
    blogTitle: postTitle,
    blogContent: postContent,
    comments: []
  })
  console.log(blog);
  blog.save();
  res.redirect("/");
});

//Get request for posts page-
app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
  Blog.find({}, function(err, posts){
    if(!err){
      posts.forEach(function(post){
        const storedTitle = _.lowerCase(post.blogTitle);
        if(storedTitle === requestedTitle){
          //Sort the comments to show the recent one
          post.comments = post.comments.sort((a,b) =>  ((a.timestamps > b.timestamps) ? -1 : ((a.timestamps < b.timestamps) ? 1 : 0)));
          res.render("post", {
            title: post.blogTitle,
            content: post.blogContent,
            id:post._id,
            comments: post.comments
          });
        }
      });
    }
    else{
      console.log(err);
    }
  });
});

//Post request to create a comment
app.post("/posts/:postName/comment", async function(req, res) {
  const {name, content} = req.body;
  //Server side form validation
  if(name ==="" || content===""){
    res.redirect(`/posts/${req.params.postName}`);
  }
  else {
    const doc = await Blog.findOne({blogTitle: req.params.postName});
    doc.comments.push({'name': name, 
                       'content': content, 
                       'timestamps': Math.floor(Date.now() / 1000)});
                       
    await Blog.updateOne({blogTitle: req.params.postName}, {comments: doc.comments}, function(err, doc) {
      if(err)
        console.log(err);
    })
    res.redirect(`/posts/${req.params.postName}`);
  }
});

//Post request to search by title
app.post("/search", function(req, res){
  const query = req.body.query;
  Blog.find({blogTitle: { "$regex": query, "$options": "i" }}, function(err, posts){
    if(!err){
      res.render('home', {
        homeStartingContent: homeStartingContent,
        posts: posts
      })
    }
  })
})

//delete post route
app.post('/posts/:postName', (req, res, next) => {
  const requestedTitle = req.params.postName;
  console.log(requestedTitle)
  Blog.deleteOne({blogTitle: requestedTitle}).then(
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
//Launching the server on port 3000-
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
