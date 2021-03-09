import React from "react";
import { motion } from "framer-motion";
import blog from "./../blog.png";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function GuestSection() {
  const { user } = useAuth();
  return (
    <motion.div
      variants={guestCardVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="col-md-6 text-center card bg-dark p-0 mx-auto mt-5"
    >
      <div className="card-header border-bottom border-secondary py-1">
        <motion.h3 variants={guestTextVariant}>About</motion.h3>
      </div>
      <div className="card-content p-2">
        <motion.img
          variants={guestTextVariant}
          src={blog}
          alt="blog"
          className="img-fluid mb-2"
          style={{ maxHeight: 200 }}
        />
        <motion.h5 variants={guestTextVariant} className="text-danger">
          Daily Journal, A blogging platform designed for little stories that
          make your day better.
        </motion.h5>
        <motion.p variants={guestTextVariant}>
          'Blog' and 'blogging' are now loosely used for content creation and
          sharing on social media, especially when the content is long-form and
          one creates and shares content on regular basis. Daily Journal is one
          such platform where one can share their day-to-day experiences. <br />{" "}
          We ensure to promote a healthy environment and help our users stay
          strong and motivated. From a food journal to a dream journal, you can
          express thoughts, share ideas and capture your interests. All you have
          to do is get started and start writing yours!
        </motion.p>
        {!user && (
          <motion.div variants={guestButtonVariant}>
            <Link
              role="button"
              to="/signUp"
              className="btn btn-sm btn-primary pb-0"
            >
              <h6>Sign Up</h6>
            </Link>
            <p className="my-2">
              Already have an account?{" "}
              <Link to="/signIn" className="ml-1 text-danger">
                Sign In
              </Link>
            </p>
          </motion.div>
        )}
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
