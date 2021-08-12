import React, { useState, useEffect } from "react";

import firebase from "./firebaseConfig";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((token) => {
          localStorage.setItem("token", token);
        });
      }
      setUser(user);
    });
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, firebase }}>
      {children}
    </AuthContext.Provider>
  );
};
