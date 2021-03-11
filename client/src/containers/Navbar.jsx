import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import icon from "./../icon.png";

const BACKEND_URL = "https://blogsite-backend-dev.herokuapp.com/";
function Navbar() {
  const { user } = useAuth();
  return (
    <nav className="navbar navbar-expand-md bg-gray shadow-md py-0 my-1">
      <div className="container">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center text-danger"
        >
          <motion.img
            src={icon}
            variants={headerIcon}
            initial="hidden"
            animate="visible"
            alt="blogchord"
            className="img-fluid mr-1"
            style={{ height: 40 }}
          />
          <motion.h3
            variants={headerTitle}
            initial="hidden"
            animate="visible"
            id="header-title"
          >
            Daily Journal
          </motion.h3>
        </Link>
        <>
          <button
            className="navbar-toggler text-danger border-danger"
            data-toggle="collapse"
            data-target="#navbar"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav ml-auto mr-2 align-items-center">
              <li className="nav-item mx-md-2 my-1">
                <Link
                  to="/"
                  className="nav-link text-light d-flex"
                  title="Home"
                >
                  <i className="fas fa-home fa-lg pt-1"></i>
                  <h5 className="d-md-none ml-2">Blogs</h5>
                </Link>
              </li>
              <li className="nav-item mx-md-2 my-1">
                <Link
                  to="/about"
                  className="nav-link text-light d-flex"
                  title="About"
                >
                  <i className="fas fa-info-circle fa-lg pt-1"></i>
                  <h5 className="d-md-none ml-2">About</h5>
                </Link>
              </li>
              {!user && (
                <li className="nav-item mx-md-2 my-1">
                  <Link
                    to="/signIn"
                    className="nav-link btn btn-sm btn-secondary text-light pb-md-2 px-2 d-flex"
                    title="Sign In"
                  >
                    <i className="fas fa-sign-in-alt fa-lg pt-1"></i>
                    <h5 className="d-md-none ml-2">Sign In</h5>
                  </Link>
                </li>
              )}
              {user && (
                <>
                  <li className="nav-item mx-md-2 my-1">
                    <Link
                      to="/dashboard"
                      className="nav-link text-light d-flex"
                      title="My Profile"
                    >
                      <i className="fas fa-user-circle fa-lg pt-1"></i>
                      <h5 className="d-md-none ml-2 pb-1">My profile</h5>
                    </Link>
                  </li>
                  <li className="nav-item mx-md-2 my-1">
                    <form action={`${BACKEND_URL}/log-out`} method="post">
                      <button
                        type="submit"
                        className="btn btn-sm btn-secondary text-light pb-md-2 d-flex"
                        title="Sign Out"
                      >
                        <i className="fas fa-sign-out-alt my-1 my-md-0 pt-md-1"></i>
                        <h6 className="d-md-none ml-2 ">Sign out</h6>
                      </button>
                    </form>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      </div>
    </nav>
  );
}

export default Navbar;

const headerIcon = {
  hidden: {
    opacity: 0,
    rotateZ: 0,
  },
  visible: {
    opacity: 1,
    rotateZ: 360,
    transition: { duration: 1 },
  },
};

const headerTitle = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
};
