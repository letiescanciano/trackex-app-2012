import React, { useState, useEffect } from "react";

import firebase from "./firebaseConfig";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser, firebase }}>
      {children}
    </AuthContext.Provider>
  );
};
