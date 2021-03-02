import React, { useContext, useEffect, useState } from "react";

export const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/currentUser")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data) {
          setUser(data.user);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Server error, Please try later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
