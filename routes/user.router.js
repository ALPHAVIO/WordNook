const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

//GET request for Sign Up
router.get("/sign-up", (req, res) => {
  res.render("signUp", {
    error: "",
    data: {
      firstName: "",
      lastName: "",
      userName: "",
      password: "",
      email: "",
    },
  });
});

// GET request for Log In
router.get("/log-in", (req, res) => {
  res.render("logIn", {
    error: "",
    data: {
      userName: "",
      password: "",
    },
  });
});

//POST request for sign up
router.post("/sign-up", (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  // Check if all the fields are filled
  if (!firstName || !lastName || !userName || !email || !password) {
    return res.status(422).render("signUp", {
      error: "Please add all the fields!",
      data: {
        firstName: firstName || "",
        lastName: lastName || "",
        userName: userName || "",
        email: email || "",
        password: password || "",
      },
    });
  }

  // Check if the username or email already taken
  User.findOne({ email }, (err, doc) => {
    if (doc) {
      return res.status(401).render("signUp", {
        error: "Email already taken!",
        data: {
          firstName,
          lastName,
          email,
          userName,
          password,
        },
      });
    }
    User.findOne({ userName }, (err, doc) => {
      if (doc) {
        return res.status(401).json({
          error: "Username already taken!",
        });
      }

      bcrypt.hash(password, 12, (err, hashedPassword) => {
        const newUser = new User({
          firstName,
          lastName,
          userName,
          email,
          password: hashedPassword,
        });

        newUser.save((err, doc) => {
          if (err || !doc) {
            return res.status(422).json("signUp", {
              error: "Oops something went wrong!",
              //   data: {
              //     firstName,
              //     lastName,
              //     userName,
              //     email,
              //     password,
              //   },
            });
          }

          const token = jwt.sign({ _id: doc._id }, process.env.SECRET_KEY);

          //Send back the token to the user as a httpOnly cookie
          res.cookie("token", token, {
            httpOnly: true,
          });
          //   res.redirect("/compose");
          res.json({ message: "User signed up successfully!!!" });
        });
      });
    });
  });
});

//POST request for log in
router.post("/log-in", (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    res.status(401).json({
      error: "Please add all the fields!",
      //   data: {
      //     userName: userName || "",
      //     password: password || "",
      //   },
    });
  }

  User.findOne({ userName }, (err, doc) => {
    if (err || !doc) {
      return res.status(401).json({
        error: "Invalid username or password!",
        // data: {
        //   userName,
        //   password,
        // },
      });
    }

    bcrypt.compare(password, doc.password, (err, matched) => {
      if (err || !matched) {
        return res.status(401).json({
          error: "Invalid username or password!",
          //   data: {
          //     userName,
          //     password,
          //   },
        });
      }

      const token = jwt.sign(
        { _id: doc._id, userName },
        process.env.SECRET_KEY
      );

      res.cookie("token", token, {
        httpOnly: true,
      });

      res.json({ message: "User signed in successfully!!!" });
    });
  });
});

router.post("/log-out", auth, (req, res) => {
  res.clearCookie("token");
  res.redirect(process.env.FRONTEND_URL);
});

router.get("/currentUser", auth, (req, res) => {
  if (req.user) {
    return res.json({ user: req.user });
  }
  return res.json(null);
});

module.exports = router;
