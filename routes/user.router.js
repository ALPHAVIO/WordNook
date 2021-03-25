// requiring dependencies, models and middlewares
const express = require("express");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const Blog = require("../models/Blog.model");

const router = express.Router();

//GET request for Sign Up
router.get("/sign-up", auth, (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("signUp", {
      error: "",
      data: {
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
        email: "",
        confirmPassword: "",
      },
    });
  }
});

// GET request for Log In
router.get("/log-in", auth, (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("logIn", {
      error: "",
      data: {
        email: "",
        password: "",
      },
    });
  }
});

//POST request for sign up
router.post("/sign-up", (req, res) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    confirmPassword,
  } = req.body;

  // Check if all the fields are filled
  if (
    !firstName ||
    !lastName ||
    !userName ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    return res.status(422).render("signUp", {
      error: "Please add all the fields!",
      data: {
        firstName: firstName || "",
        lastName: lastName || "",
        userName: userName || "",
        email: email || "",
        password: password || "",
        confirmPassword: confirmPassword || " ",
      },
    });
  }

  const emailRegx = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  const pwdRegex = new RegExp(
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  );
  if (userName.length < 6 || userName.length > 12) {
    return res.status(500).render("signUp", {
      error: "Username should be between 6 to 12 character",
      data: {
        firstName,
        lastName,
        userName,
        email,
        password,
        confirmPassword,
      },
    });
  }

  if (!emailRegx.test(email)) {
    return res.status(500).render("signUp", {
      error: "Please enter a valid email address",
      data: {
        firstName,
        lastName,
        userName,
        email,
        password,
        confirmPassword,
      },
    });
  }

  if (pwdRegex.test(password)) {
    return res.status(500).render("signUp", {
      error:
        "Your password must contain a minimum of 8 letter, with at least a symbol, upper and lower case letters and a number",
      data: {
        firstName,
        lastName,
        userName,
        email,
        password,
      },
    });
  }

  if (password !== confirmPassword) {
    return res.status(500).render("signUp", {
      error: "Password does not match",
      data: {
        firstName,
        lastName,
        userName,
        email,
        password,
        confirmPassword,
      },
    });
  }
  // Check if the username or email already taken
  User.findOne({ $or: [{ email }, { userName }] }, (err, doc) => {
    if (doc) {
      let error = "Username already taken!";
      if (doc.email == email) error = "Email already taken!";
      console.log(error);
      return res.status(401).render("logIn", {
        error,
        data: {
          firstName,
          lastName,
          email,
          userName,
          password,
          confirmPassword,
        },
      });
    }
    User.findOne({ userName }, (err, doc) => {
      if (doc) {
        return res.status(401).render("logIn", {
          error: "Username already taken!",
          data: {
            firstName,
            lastName,
            userName,
            password,
            email,
            confirmPassword,
          },
        });
      }

      const newUser = new User(req.body);

      newUser.save((err, doc) => {
        if (err || !doc) {
          return res.status(422).render("logIn", {
            error: "Oops something went wrong!",
            data: {
              firstName,
              lastName,
              userName,
              email,
              password,
              confirmPassword,
            },
          });
        }

        const token = jwt.sign({ _id: doc._id }, process.env.SECRET_KEY);

        //Send back the token to the user as a httpOnly cookie
        res.cookie("token", token, {
          httpOnly: true,
        });
        res.redirect("/");
      });
    });
  });
});

//POST request for log in
router.post("/log-in", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).render("logIn", {
      error: "Please add all the fields!",
      data: {
        email: email || "",
        password: password || "",
      },
    });
  }

  User.findOne({ email }, (err, doc) => {
    if (err || !doc) {
      return res.status(401).render("logIn", {
        error: "Invalid email or password!",
        data: {
          email,
          password,
        },
      });
    }

    bcrypt.compare(password, doc.password, (err, matched) => {
      if (err || !matched) {
        return res.status(401).render("logIn", {
          error: "Invalid email or password!",
          data: {
            email,
            password,
          },
        });
      }

      const token = jwt.sign(
        { _id: doc._id, email },
        process.env.SECRET_KEY
      );

      res.cookie("token", token, {
        httpOnly: true,
      });

      res.redirect("/");
    });
  });
});

// Post route for log-out
router.post("/log-out", auth, (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

//*route    /author/:id
//*desc     Fetch the required user's blogs
router.get("/author/:id", auth, async (req, res) => {
  try {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.redirect("/error");
      const blogs = await Blog.find({ author: req.params.id })
        .populate("author")
        .sort({ timestamps: "desc" })
        .lean();
      return res.render("author", {
        user,
        posts: blogs,
        isAuthenticated: req.user ? true : false,
      });
    } catch (error) {
      return res.redirect("/error");
    }
  } catch (error) {
    return res.redirect("/error");
  }
});

module.exports = router;
