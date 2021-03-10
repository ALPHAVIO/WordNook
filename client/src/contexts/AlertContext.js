import React, { useState, useContext } from "react";

export const AlertContext = React.createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

function AlertProvider({ children }) {
  const [alert, setAlert] = useState("");

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export default AlertProvider;
