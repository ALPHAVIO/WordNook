//jshint esversion:6

//Acquiring Dependencies- 
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");
const PORT = process.env.PORT || 3000;
//darkmode
const Darkmode = require("darkmode-js") ;
//middleware for authentication
const auth = require("./middlewares/auth");


const options = {
  bottom: '64px', // default: '32px'
  right: 'unset', // default: '32px'
  left: '32px', // default: 'unset'
  time: '0.5s', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '#fff',  // default: '#fff'
  buttonColorDark: '#100f2c',  // default: '#100f2c'
  buttonColorLight: '#fff', // default: '#fff'
  saveInCookies: false, // default: true,
  label: '🌗', // default: ''
  autoMatchOsTheme: true // default: true
}

const darkmode = new Darkmode(options);
darkmode.showWidget();


//Default Texts-
const homeStartingContent = "I'm Daily Journal, your best pal. What do I do? Well, I'm here to help you out. I'll be there to listen to your thoughts or share with you my pal's ideas and few amazing blogs.That's all? Not yet. I'm here to take you on a wonderful journey of unlimited thoughts and help you find your twin souls too!!! Sounds great? Here we go....Let's get started.";
const aboutContent = "'Blog' and 'blogging' are now loosely used for content creation and sharing on social media, especially when the content is long-form and one creates and shares content on regular basis.";
const contactContent = "Got a query to ask? Have an amazing idea? Loved our page? Okay! All you have to do is shoot a mail and we'll get back to you shortly.";

//Setting up the app and the ejs view engine-
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
//When in development mode then only require the dotenv module
if(process.env.NODE_ENV !== 'production'){
  const dotenv = require('dotenv');
  dotenv.config({path:'./.env'});
}

//Connecting to Mongo Database using ODM Mongoose-
const URL = process.env.URL;
mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true});

//Setting up schema for the collection-
const blogSchema = {
  blogTitle: String,
  blogContent: String,
  comments: Array,
  timestamps: {
    type: Date, 
    default: Date.now
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}

//Making a MongoDB model for the schema-
const Blog = new mongoose.model("Blog", blogSchema);

// Router for user login and sign in
app.use(require("./routes/user.router"));

//Get request for home route-
app.get(["/", "/page/:page", "/page/:perPage", "/page/:page/:perPage"], function(req, res){
  var perPage = parseInt(req.params.perPage) || 5;
  if(req.query.perPage>0)
    perPage =  parseInt(req.query.perPage);
  const currentPage = req.params.page || 1;
  const order = req.query.order || "new one first";
  Blog
  .find({})
  .sort({'timestamps': (order === "new one first")?'desc':'asc'})
  .skip((perPage * currentPage) - perPage)
  .limit(perPage)
  .exec(function(err, foundBlogs) {
    Blog.count().exec(function(err, count) {
      if(err)
        console.log(err);
      else {
        res.render("home", {
          homeStartingContent: homeStartingContent,
          posts: foundBlogs,
          current: currentPage,
          pages: Math.ceil(count/perPage),
          search: "",
          perPage: perPage,
          order: order
        });
      }
    })
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
app.get("/compose", auth, function(req, res){
  const user = req.user;
  if(!user){
    return res.status(401).redirect("/log-in");
  }
  res.render("compose");
});

//Post request to save the new blogs to the DB
app.post("/compose", auth, function(req, res){
  const user = req.user;
  if(!user){
    return res.status(401).redirect("/log-in");
  }
  const postTitle = req.body.postTitle;
  const postContent = req.body.postBody;
  const blog = new Blog({
    blogTitle: postTitle,
    blogContent: postContent,
    comments: [],
    author: user._id
  })
  console.log(blog);
  blog.save();
  res.redirect("/");
});

//Get request for posts page-
app.get(["/posts/:postName", "/page/posts/:postName", "/page/:page/posts/:postName", "/search/:query/posts/:postName", "/search/:query/:page/posts/:postName"], auth, function(req, res){
  const user = req.user;
  let isAuthor = false;
  const requestedTitle = _.lowerCase(req.params.postName);
  Blog.find({}, function(err, posts){
    if(!err){
      posts.forEach(function(post){
        const storedTitle = _.lowerCase(post.blogTitle);
        if(storedTitle === requestedTitle){
          // Check if the user and author of this post are same
          if(user && JSON.stringify(user._id) === JSON.stringify(post.author)){
            isAuthor = true;
          }
          //Sort the comments to show the recent one
          post.comments = post.comments.sort((a,b) =>  ((a.timestamps > b.timestamps) ? -1 : ((a.timestamps < b.timestamps) ? 1 : 0)));
          res.render("post", {
            title: post.blogTitle,
            content: post.blogContent,
            id:post._id,
            comments: post.comments,
            isAuthor
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
app.post(["/search"], function(req, res){
  const query = req.body.query || req.params.query;
  var perPage = 5;
  const currentPage = req.params.page || 1;

  Blog.find({blogTitle: { "$regex": query, "$options": "i" }})
  .skip((perPage * currentPage) - perPage)
  .sort({'timestamps': 'desc'})
  .limit(perPage)
  .exec( function(err, posts) {
    Blog.countDocuments({blogTitle: { "$regex": query, "$options": "i" }}, function(err, count) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts,
        current: currentPage,
        pages: Math.ceil(count/perPage),
        search: query,
        perPage: perPage,
        order: 'new one first'
      });
    })
    
  })
})

// GET request for search to support pagination
app.get(["/search/:query/:page", "/search/:query", "/search/:query/:page/:perPage", "/search/:query"], function(req, res){
  const query = req.params.query;
  var perPage = parseInt(req.params.perPage) || 5;
  if(req.query.perPage>0)
    perPage =  parseInt(req.query.perPage);
  const order = req.query.order || "new one first";
  const currentPage = req.params.page || 1;

  Blog.find({blogTitle: { "$regex": query, "$options": "i" }})
  .sort({'timestamps': (order === "new one first")?'desc':'asc'})
  .skip((perPage * currentPage) - perPage)
  .limit(perPage)
  .exec( function(err, posts) {
    Blog.countDocuments({blogTitle: { "$regex": query, "$options": "i" }}, function(err, count) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts,
        current: currentPage,
        pages: Math.ceil(count/perPage),
        search: query,
        perPage: perPage,
        order: order
      });
    })
    
  })
})

//delete post route
app.post('/posts/:postName', auth, (req, res, next) => {
  const user = req.user;
  if(!user) {
    return res.status(401).redirect("/log-in");
  }

  const requestedTitle = req.params.postName;
  console.log(requestedTitle)
  Blog.deleteOne({blogTitle: requestedTitle, author: user._id}).then(
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
//Launching the server on port 3000 in development mode-
app.listen(PORT, function() {
  console.log("Server started on port 3000");
});
