import React, { useState, useEffect, createContext } from "react";
import { auth } from '../config/firebaseConfig'; 
 
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => { // Usa la instancia de auth correctamente
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe; // Limpia la suscripción cuando el componente se desmonte
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const loginUser = async (email, password) => {
  // Implementación de la función de inicio de sesión
};

export default AuthContext;
