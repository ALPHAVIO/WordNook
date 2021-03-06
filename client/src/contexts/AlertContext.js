import React, { useState, useContext, useEffect } from "react";

export const AlertContext = React.createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

function AlertProvider({ children }) {
  const [alert, setAlert] = useState("");

  // useEffect(() => {
  //   console.log(alert);
  // }, [alert]);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export default AlertProvider;
