import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import AlertProvider from "./contexts/AlertContext";
import Routes from "./routes/Routes";
import Loader from "./containers/Loader";
import Navbar from "./containers/Navbar";

function App() {
  const { loading } = useAuth();
  return loading ? (
    <Loader height="100" />
  ) : (
    <>
      <Router>
        <AlertProvider>
          <Navbar />
          <Routes />
        </AlertProvider>
      </Router>
    </>
  );
}

export default App;
