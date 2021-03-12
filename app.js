//jshint esversion:6

//Acquiring Dependencies-
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");
const PORT = process.env.PORT || 3000;
const auth = require('./middlewares/auth');
const Blog = require('./models/Blog.model')


//Setting up the app and the ejs view engine-
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
//When in development mode then only require the dotenv module
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config({ path: './.env' });
}

//Connecting to Mongo Database using ODM Mongoose-
const URL = "mongodb://localhost:27017/blogDB";
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

// Router for user login and sign in
app.use(require("./routes/user.router"));

//router for post and search related urls
app.use(require("./routes/post.router"));

// router for the requests from home page
app.use(require("./routes/index.router"));


//Launching the server on port 3000 in development mode-
app.listen(PORT, function () {
  console.log("Server started on port 3000");
});
