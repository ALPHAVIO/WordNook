import React from "react";
import avatar from "./../../avatar.png";
function UserProfile({ user }) {
  return (
    <div className="d-flex align-items-center text-center justify-content-center py-2">
      <img
        src={avatar}
        alt="profile"
        className="img-fluid mb-2 rounded-circle"
        style={{ height: 80 }}
      />
      <h5 className="ml-3">{user.name || user.userName}</h5>
    </div>
  );
}

export default UserProfile;
