import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "./../../../contexts/AuthContext";
import { useAlert } from "./../../../contexts/AlertContext";
import { useHistory } from "react-router";
import Loader from "../../../containers/Loader";
import ErrorBox from "../error/ErrorBox";
import BlogPost from "./BlogPost";

function Edit(props) {
  const { user } = useAuth();
  const { setAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);
  const titleRef = useRef("");
  const statusRef = useRef("Public");
  const [body, setBody] = useState("");
  const history = useHistory();

  const editBlog = async (event) => {
    event.preventDefault();
    if (body !== "<p><br></p>") {
      setDisableButtons(true);
      let blog = {
        blogTitle: titleRef.current.value,
        status: statusRef.current.value,
        blogContent: body,
        user: user._id,
      };
      // console.log(newBlog);
      fetch(`/edit/${props.match.params.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blog),
      })
        .then((res) => res.json())
        .then((data) => {
          setAlert(data.msg);
          if (data.isSuccess) {
            history.push(`/posts/${props.match.params.id}`);
          }
        })
        .finally(() => setDisableButtons(false));
    } else setAlert("No blank fields.");
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    setDisableButtons(false);
    fetch(`/posts/${props.match.params.id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (!data.msg) {
          titleRef.current = data.blog.blogTitle;
          statusRef.current = data.blog.status;
          setBody(data.blog.blogContent);
        } else {
          setError(true);
          setAlert(data.msg);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loader height="80" />
  ) : (
    <>
      {error ? (
        <ErrorBox />
      ) : (
        <BlogPost
          type="Edit"
          titleRef={titleRef}
          statusRef={statusRef}
          body={body}
          setBody={setBody}
          handleSubmit={editBlog}
          disableButtons={disableButtons}
        />
      )}
    </>
  );
}

export default Edit;
