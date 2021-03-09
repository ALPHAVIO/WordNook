import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import { useAuth } from "../contexts/AuthContext";
import Loader from "./../containers/Loader";
import ErrorBox from "./components/error/ErrorBox";
import BlogsContainer from "./containers/BlogsContainer";

function Home() {
  // const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch("/blogs")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.blogs) {
          setBlogs(data.blogs);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        setError(true);
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return error ? (
    <ErrorBox />
  ) : (
    <motion.div
      variants={homeVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="col-md-8 mx-auto"
    >
      <div className="d-flex align-items-center my-2">
        <h4>Recent Blogs</h4>
        <Link to="/compose" className="btn btn-sm btn-info ml-auto pb-0">
          <h6>Post a blog</h6>
        </Link>
      </div>
      {loading ? (
        <Loader height="50" />
      ) : (
        <div className="row">
          {blogs && <BlogsContainer displayBlogs={blogs} isProfile={false} />}
        </div>
      )}
    </motion.div>
  );
}

export default Home;

const homeVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
  exit: {
    opacity: 0,
    transition: { ease: "easeInOut" },
  },
};
