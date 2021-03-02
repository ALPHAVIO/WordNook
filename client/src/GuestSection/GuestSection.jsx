import React from "react";
import { motion } from "framer-motion";
import blog from "./../blog.png";
import { Link } from "react-router-dom";

function GuestSection() {
  return (
    <motion.div
      variants={guestCardVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="col-md-4 text-center card bg-dark p-0 mx-auto mt-5"
    >
      <div className="card-header border-bottom border-secondary py-1">
        <motion.h3 variants={guestTextVariant}>Welcome user!</motion.h3>
      </div>
      <div className="card-content p-2">
        <motion.img
          variants={guestTextVariant}
          src={blog}
          alt="blog"
          className="img-fluid mb-2"
        />
        <motion.h5 variants={guestTextVariant} className="text-danger">
          Post creative blogs...
        </motion.h5>
        <motion.p variants={guestTextVariant}>
          A blogging platform designed for little stories that make your day
          better.
        </motion.p>
        <motion.div variants={guestButtonVariant}>
          <Link
            role="button"
            to="/signUp"
            className="btn btn-sm btn-primary pb-0"
          >
            <h6>SignUp</h6>
          </Link>
          <p className="my-2">
            Already have an account?{" "}
            <Link to="/signIn" className="ml-1 text-danger">
              SignIn
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default GuestSection;

const guestCardVariant = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
    transition: { delay: 0.1, duration: 0.7 },
  },
  exit: {
    scale: 0,
    transition: { delay: 0.2, duration: 1, ease: "easeInOut" },
  },
};

const guestTextVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 0.8, duration: 0.7 },
  },
  exit: {
    opacity: 0,
    transition: { delay: 0.1, duration: 1, ease: "easeInOut" },
  },
};

const guestButtonVariant = {
  hidden: {
    opacity: 0,
    y: "5vh",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 1, duration: 0.7 },
  },
  exit: {
    opacity: 0,
    y: "5vh",
    transition: { delay: 0.1, duration: 1, ease: "easeInOut" },
  },
};
