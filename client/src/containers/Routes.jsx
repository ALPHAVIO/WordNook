import React from "react";
import { useLocation } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { AnimatePresence } from "framer-motion";

import GuestSection from "./../GuestSection/GuestSection";
import Home from "../AuthSection/Home";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

function Routes() {
  const location = useLocation();
  const { user } = useAuth();
  return (
    <div className="container mt-3">
      {/* <Alert /> */}
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route exact path="/">
            {user ? <Home /> : <GuestSection />}
          </Route>
          <Route exact path="/signIn">
            {user ? <Home /> : <SignIn />}
          </Route>
          <Route exact path="/signUp">
            {user ? <Home /> : <SignUp />}
          </Route>
          {/* <AuthRoute exact path="/dashboard" component={Dashboard} />
          <AuthRoute exact path="/post" component={Post} />
          <AuthRoute exact path="/edit/:id" component={Edit} />
          <AuthRoute exact path="/read/:id" component={Blog} />
          <AuthRoute exact path="/user/:userId" component={ProfileVisit} /> */}
          <Redirect from="*" to="/" />
        </Switch>
      </AnimatePresence>
    </div>
  );
}

export default Routes;
