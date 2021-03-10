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

// load the models
const Blog = require('./models/Blog.model')
const User = require('./models/User.model')


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
const URL = process.env.URL;
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

// Router for user login and sign in
app.use(require("./routes/user.router"));
// ROuter for home routes
app.use(require('./routes/index.router'))
//Get request for posts page-
app.use(require("./routes/posts.route"))
//Launching the server on port 3000 in development mode-
app.listen(PORT, function () {
  console.log("Server started on port 3000");
});
