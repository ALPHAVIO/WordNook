import React, { useEffect } from "react";
import { useState } from "react";
import { useAlert } from "../../contexts/AlertContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  updateBookmark,
  deleteBlog,
  getLoggedInUserDetails,
  updateLikes,
} from "../db/useDB";
import Card from "./Card";
import CardNotFound from "./CardNotFound";

function BlogsContainer({ displayBlogs }) {
  const { user } = useAuth();
  const { setAlert } = useAlert();
  const [savedLists, setSavedLists] = useState([]);

  useEffect(() => {
    initialSetup();
  }, []);

  const initialSetup = async () => {
    const data = await getLoggedInUserDetails(user?._id);
    setSavedLists(data.savedBlogsList?.blogs);
  };

  const addBookmark = async (blogId) => {
    if (!savedLists?.includes(blogId)) {
      let updatedList = [blogId, ...savedLists];
      let res = await updateBookmark(updatedList, user._id);
      setSavedLists(updatedList);
      setAlert(res.status === 200 ? "Bookmark added ★" : res.msg);
    } else alert("Blog is already saved");
  };

  const removeBookmark = async (blogId) => {
    if (savedLists?.includes(blogId)) {
      let updatedList = savedLists.filter(
        (savedId) => savedId.toString() !== blogId.toString()
      );
      let res = await updateBookmark(updatedList, user._id);
      setSavedLists(updatedList);
      setAlert(res.status === 200 ? "Bookmark removed ☆" : res.msg);
    } else alert("Blog wasn't saved");
  };

  const likeBlog = async (blog) => {
    if (!blog.likes.includes(user._id)) {
      let updatedLikes = {
        likes: [...blog.likes, user._id],
      };
      await updateLikes(updatedLikes, blog._id);
    }
  };

  const dislikeBlog = async (blog) => {
    if (blog.likes.includes(user._id)) {
      let updatedLikes = {
        likes: blog.likes.filter((id) => id !== user._id),
      };
      await updateLikes(updatedLikes, blog._id);
    }
  };

  const handleDelete = async (id, access) => {
    if (access) {
      if (window.confirm("Are you sure to delete this blog?")) {
        let res = await deleteBlog(id);
        setAlert(res.msg);
      }
    }
  };

  return displayBlogs.length ? (
    displayBlogs.map((blog) =>
      blog.status === "NotFound" ? (
        <CardNotFound
          key={blog._id}
          blog={blog}
          access={true}
          addBookmark={addBookmark}
          isBookmarked={savedLists?.includes(blog._id)}
          removeBookmark={removeBookmark}
        />
      ) : (
        <Card
          key={blog._id}
          blog={blog}
          access={user?._id === blog.author._id}
          addBookmark={addBookmark}
          isBookmarked={savedLists?.includes(blog._id)}
          removeBookmark={removeBookmark}
          handleDelete={handleDelete}
          likes={blog.likes}
          isLiked={blog.likes.includes(user?._id)}
          likeBlog={likeBlog}
          dislikeBlog={dislikeBlog}
        />
      )
    )
  ) : (
    <div className="col-md-8 text-center">
      <p className="text-muted lead my-3">No blog found.</p>
    </div>
  );
}

export default BlogsContainer;
