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
  const [displayBlogs, setDisplayBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("");
  const categories = [
    "IT & Software",
    "Business",
    "Personality Development",
    "Design",
    "Marketing",
    "Lifestyle",
    "Photography",
    "Health & Fitness",
    "Music",
    "Academics",
    "Language",
    "Sports",
    "Social media",
    "History",
    "Space and Research",
  ];
  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch("/blogs")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.blogs) {
          setBlogs(data.blogs);
          setDisplayBlogs(data.blogs);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        setError(true);
        // console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // console.log(category);
    if (category) {
      setDisplayBlogs(blogs.filter((blog) => blog.category === category));
    } else {
      setDisplayBlogs(blogs);
    }
  }, [category, blogs]);

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
          <div className="col-md-8 d-flex my-2 mx-auto">
            <select
              type="text"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option></option>
              {categories.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          {blogs && <BlogsContainer displayBlogs={displayBlogs} />}
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
