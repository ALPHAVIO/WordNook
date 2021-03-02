import React from "react";
import { AnimatePresence, motion } from "framer-motion";

function Loader({ height }) {
  const loadingStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: `${height}vh`,
    margin: "auto",
  };

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        variants={loaderVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={loadingStyle}
      >
        <div className="spinner-border text-danger" role="status">
          <span className="sr-only"></span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Loader;

const loaderVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 0.2, duration: 0.8 },
  },
  exit: {
    opacity: 0,
    transition: { delay: 0.2, duration: 0.8, ease: "easeInOut" },
  },
};
