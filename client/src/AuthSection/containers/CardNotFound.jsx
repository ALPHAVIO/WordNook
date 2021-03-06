import { motion } from "framer-motion";
import React from "react";

function CardNotFound({
  blog,
  access,
  addBookmark,
  removeBookmark,
  isBookmarked,
}) {
  return (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="col-lg-5 card mx-2 mx-md-auto my-2 p-3 shadow-lg bg-dark rounded text-center"
    >
      <h1>
        <i className="fas fa-exclamation-triangle text-danger"></i>
      </h1>
      <h6 className="text-danger">{blog.body}</h6>
      {access && (
        <h6 className="text-primary m-1">
          Remove from bookmarks? <br />
          <motion.i
            variants={starVariant}
            whileHover="hover"
            whileTap="tap"
            className={`${isBookmarked ? "fas fa-star" : "far fa-star"}`}
            style={{ cursor: "pointer" }}
            onClick={
              isBookmarked
                ? () => removeBookmark(blog._id)
                : () => addBookmark(blog._id)
            }
          ></motion.i>
        </h6>
      )}
    </motion.div>
  );
}

export default CardNotFound;

const cardVariant = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
    transition: {
      delay: 0.2,
      duration: 0.5,
    },
  },
  exit: {
    scale: 0,
    transition: {
      delay: 0.2,
      duration: 0.5,
      transition: { ease: "easeInOut" },
    },
  },
};

const starVariant = {
  hover: {
    scale: 1.1,
    fill: "#007bff",
  },
  tap: {
    scale: 0.8,
  },
};
