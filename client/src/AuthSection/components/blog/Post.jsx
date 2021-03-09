import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import { useAlert } from "../../../contexts/AlertContext";
// import { useAuth } from "../../../contexts/AuthContext";
import BlogPost from "./BlogPost";

function Post() {
  // const { user } = useAuth();
  const { setAlert } = useAlert();
  const [disableButtons, setDisableButtons] = useState(false);
  const titleRef = useRef("");
  const statusRef = useRef("Public");
  const [body, setBody] = useState("");
  const history = useHistory();

  const postBlog = (event) => {
    event.preventDefault();
    if (body && body !== "<p><br></p>") {
      setDisableButtons(true);
      let newBlog = {
        blogTitle: titleRef.current.value,
        status: statusRef.current.value,
        blogContent: body,
      };
      // console.log(newBlog);
      fetch("/compose", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBlog),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.blogId) {
            // console.log(data.blogId);
            history.push(`/posts/${data.blogId}`);
          }
          setAlert(data.msg);
        })
        .catch(() => {
          setAlert("Server Error");
        })
        .finally(() => setDisableButtons(false));
    } else setAlert("No blank fields.");
  };

  return (
    <div className="row">
      <BlogPost
        type="Compose"
        titleRef={titleRef}
        statusRef={statusRef}
        body={body}
        setBody={setBody}
        handleSubmit={postBlog}
        disableButtons={disableButtons}
      />
    </div>
  );
}

export default Post;
