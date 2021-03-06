export async function getLoggedInUserDetails(id) {
  try {
    let res = await fetch(`/users/auth/${id}`);
    let data = await res.json();
    // console.log(data);
    return data;
  } catch (error) {
    alert(error.msg);
  }
}

export async function updateLikes(updatedLikes, blogId) {
  try {
    let res = await fetch(`/blogs/updateLikes/${blogId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedLikes),
    });
    return res;
  } catch (error) {
    console.log(error);
    alert(error.msg);
    return { status: 500 };
  }
}

export async function deleteBlog(id) {
  try {
    let res = await fetch(`/blogs/delete/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    return data;
  } catch (error) {
    alert(error.msg);
  }
}

export async function addToBookmark(blogId, userId) {
  try {
    const newBlog = {
      blogId,
      userId,
    };
    let res = await fetch("/users/addBookmark", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBlog),
    });
    let data = await res.json();
    return data;
  } catch (error) {
    alert(error.msg);
  }
}

export async function updateBookmark(updatedList, userId) {
  try {
    const updateList = {
      blogs: updatedList,
      userId,
    };
    // console.log(updateList);
    let res = await fetch("/users/bookmarks", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateList),
    });
    let data = await res.json();
    return data;
  } catch (error) {
    alert(error.msg);
  }
}
