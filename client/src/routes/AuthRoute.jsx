import React from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function AuthRoute({ component: Component, ...rest }) {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        return user ? <Component {...props} /> : <Redirect to="/" />;
      }}
    ></Route>
  );
}

export default AuthRoute;
