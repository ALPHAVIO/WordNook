//jshint esversion:6

//Acquiring Dependencies- 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

//Default Texts-
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//Setting up the app and the ejs view engine-
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connecting to Mongo Database using ODM Mongoose-
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

//Setting up schema for the collection-
const blogSchema = {
  blogTitle: String,
  blogContent: String,
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
          res.render("post", {
            title: post.blogTitle,
            content: post.blogContent,
            id:post._id
          });
        }
      });
    }
    else{
      console.log(err);
    }
  });
});
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
