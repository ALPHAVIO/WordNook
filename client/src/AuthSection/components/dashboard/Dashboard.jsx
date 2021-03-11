import React, { useState } from "react";
import UserProfile from "../../containers/UserProfile";
import SelectOptions from "./SelectOptions";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import BlogsContainer from "../../containers/BlogsContainer";
import { getLoggedInUserDetails } from "../../db/useDB";
import Loader from "../../../containers/Loader";

function Dashboard() {
  const { user } = useAuth();
  const [allBlogs, setAllBlogs] = useState(null);
  const [selectedOption, setSelectedOption] = useState("all");
  const [displayBlogs, setDisplayBlogs] = useState(null);
  const [savedBlogs, setSavedBlogs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLoggedInUserDetails(user._id).then((data) => {
      setAllBlogs(data?.blogs);
      setDisplayBlogs(data?.blogs);
      setSavedBlogs(data?.savedBlogs);
      setLoading(false);
    });
  }, [user]);

  const setSelection = (id) => {
    setSelectedOption(id);

    switch (id) {
      case "all":
        return setDisplayBlogs(allBlogs);
      case "public":
        return setDisplayBlogs(
          allBlogs.filter((blog) => blog.status === "Public")
        );
      case "private":
        return setDisplayBlogs(
          allBlogs.filter((blog) => blog.status === "Private")
        );
      case "saved":
      default:
        return setDisplayBlogs(savedBlogs);
    }
  };

  return (
    <motion.div
      variants={dashboardVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="row align-items-start"
    >
      <div className="col-md-3 my-2 bg-dark p-2 mx-2">
        <h4 className="text-center text-secondary border-bottom border-danger pb-2">
          Dashboard
        </h4>
        <UserProfile user={user} />
      </div>
      <div className="col-md-8 my-2 mx-auto">
        <div className="d-flex align-items-center my-2">
          <h4>Your Blogs</h4>
          <Link to="/compose" className="btn btn-sm btn-info ml-auto pb-0">
            <h6>Post a blog</h6>
          </Link>
        </div>
        {allBlogs && (
          <SelectOptions
            selectOptions={setSelection}
            selectedOption={selectedOption}
          />
        )}
        <div className="row">
          {loading && <Loader height={50} />}
          {displayBlogs && <BlogsContainer displayBlogs={displayBlogs} />}
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;

const dashboardVariant = {
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
