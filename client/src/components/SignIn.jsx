import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";
import Form from "./Form";

function SignIn() {
  const { setAlert } = useAlert();

  const signinUser = (user) => {
    console.log(user);

    fetch("/log-in", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          setAlert(data.error);
        } else if (data.message) {
          setAlert(data.message + " Refresh to continue...");
        }
      })
      .catch((err) => {
        console.log(err);
        setAlert("Server Error");
      });
  };

  return (
    <motion.div
      variants={signInVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container"
    >
      <div className="row">
        <div className="col-md-5 card mx-2 my-5 p-0 mx-md-auto">
          <div className="card-header">
            <h4 className="text-danger text-center">Sign In</h4>
          </div>
          <div className="card-content p-3">
            <Form type="signin" handleSubmit={signinUser} />
          </div>
          <p className="my-2 text-dark text-center">
            Don't have an account?{" "}
            <Link to="/signUp" className="ml-1 text-danger">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default SignIn;

const signInVariant = {
  hidden: {
    y: "-100vh",
  },
  visible: {
    y: "0",
    transition: {
      delay: 0.2,
      durations: 1,
      type: "spring",
      stiffness: 100,
    },
  },
  exit: {
    y: "100vh",
    transition: { ease: "easeInOut" },
  },
};
