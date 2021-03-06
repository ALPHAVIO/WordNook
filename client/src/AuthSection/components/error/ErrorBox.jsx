import React from "react";
import error from "./error.png";

function ErrorBox() {
  return (
    <div className=" mx-2 mx-md-auto text-center">
      <img
        src={error}
        alt="Error"
        className="img-fluid my-5"
        style={imgStyle}
      />
      <h5>Something went wrong!</h5>
      <p>Head back & refresh to continue.</p>
    </div>
  );
}

export default ErrorBox;

const imgStyle = {
  height: "50vh",
};
