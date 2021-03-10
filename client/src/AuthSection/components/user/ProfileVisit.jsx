import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import { useAlert } from "../../../contexts/AlertContext";
import Loader from "../../../containers/Loader";
import ErrorBox from "../error/ErrorBox";
import UserProfile from "../../containers/UserProfile";
import BlogsContainer from "../../containers/BlogsContainer";

function ProfileVisit(props) {
  const { user } = useAuth();
  const { setAlert } = useAlert();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user?._id !== props.match.params.authorId) {
      setLoading(true);
      setError(false);
      fetch(`/authors/${props.match.params.authorId}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          if (data.user) {
            setProfile(data.user);
            setBlogs(data.blogs);
          } else {
            setError(true);
            setAlert(data.msg);
          }
        })
        .catch((err) => {
          // console.log(err);
          setAlert("Server error, Please try later");
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [props.match.params.authorId, user]);
  return user && user?._id === props.match.params.authorId ? (
    <Redirect to="/dashboard" />
  ) : loading ? (
    <Loader height="80" />
  ) : error ? (
    <ErrorBox />
  ) : (
    <motion.div
      variants={profileVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="row align-items-start"
    >
      <div className="col-md-3 my-2 bg-dark p-2 mx-2">
        <UserProfile user={profile} />
      </div>
      <div className="col-md-8 mx-auto my-2">
        <h4>Blogs</h4>
        <div className="row">
          {blogs && <BlogsContainer displayBlogs={blogs} />}
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileVisit;

const profileVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { delay: 0.2, ease: "easeInOut" },
  },
};
