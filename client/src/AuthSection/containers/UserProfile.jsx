import React from "react";

function UserProfile({ user }) {
  return (
    <div className="d-flex d-md-block align-items-center text-center pb-2">
      <img
        src={`${user.image}`}
        alt="profile"
        className="img-fluid mb-2 rounded-circle"
      />
      <h5 className="m-auto my-md-3">{user.displayName}</h5>
    </div>
  );
}

export default UserProfile;
