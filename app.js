//jshint esversion:6
//Acquiring Dependencies-
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");

//Setting up the app middlewares and the ejs view engine-
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

//When in development mode then only require the dotenv module
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({ path: "./.env" });
}

//Connecting to Mongo Database using ODM Mongoose-
connectDB();
mongoose.set("useCreateIndex", true);

// router for the requests from home page
app.use(require("./routes/index.router"));

// Router for user login and sign in
app.use(require("./routes/user.router"));

//router for post and search related urls
app.use(require("./routes/post.router"));

//routing to 404 in case of unavilable urls.
app.use("*", (req, res) => {
  res.render('404',{
    isAuthenticated: req.user ? true : false
  })
});

//Launching the server on port 3000 in development mode-
app.listen(PORT, function () {
  console.log(`Server started on port: ${PORT}`);
});
