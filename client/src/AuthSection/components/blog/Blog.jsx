import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { motion } from "framer-motion";
import UserProfile from "../../containers/UserProfile";
import { useAuth } from "../../../contexts/AuthContext";
import { useAlert } from "../../../contexts/AlertContext";
import Loader from "../../../containers/Loader";

function Blog(props) {
  const { user } = useAuth();
  const { setAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [blog, setBlog] = useState({});

  useEffect(() => {
    // if (props.match.params.id) {
    //   console.log(props.match.params.id);
    //   return;
    // }
    setLoading(true);
    setError(false);
    fetch(`/posts/${props.match.params.id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (!data.msg) {
          setBlog(data.blog);
        } else {
          setError(true);
          setAlert(data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        setAlert("Server Error");
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loader height="50" />
  ) : (
    !error && blog && (
      <div className="row">
        <motion.div
          variants={blogAuthorVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="col-md-4 my-2"
        >
          <h4 className="text-center text-danger">Author</h4>
          <UserProfile user={blog.author} />
          <Link
            to={`${
              blog.author._id !== user._id
                ? `/author/${blog.author._id}`
                : "/dashboard"
            }`}
            className="btn btn-info btn-sm btn-block my-2"
          >
            Visit Profile
          </Link>
        </motion.div>
        <motion.div
          variants={blogContentVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="col-md-7 mx-2 p-2 my-2 mx-md-auto bg-dark"
        >
          <h3 className="text-center text-warning mb-1">{blog.blogTitle}</h3>
          <p className="pb-1 text-muted text-center border-bottom border-secondary">
            <i className="fas fa-clock mr-1"></i>
            <span>{new Date(blog.timestamps).toDateString()}</span>
          </p>
          <div
            className="border-left border-danger m-2 p-2"
            dangerouslySetInnerHTML={{ __html: blog.blogContent }}
          >
            {/* <ReactQuill
              className="bg-dark text-white"
              value={blog.body}
              readOnly={true}
              theme="bubble"
            /> */}
          </div>
        </motion.div>
      </div>
    )
  );
}

export default Blog;

const blogAuthorVariant = {
  hidden: {
    x: "-100vw",
  },
  visible: {
    x: 0,
    transition: {
      delay: 0.5,
      duration: 1,
    },
  },
  exit: {
    x: "-100vw",
    transition: { ease: "easeInOut" },
  },
};

const blogContentVariant = {
  hidden: {
    x: "100vw",
  },
  visible: {
    x: 0,
    transition: {
      delay: 0.5,
      duration: 1,
    },
  },
  exit: {
    x: "100vw",
    transition: { ease: "easeInOut" },
  },
};
