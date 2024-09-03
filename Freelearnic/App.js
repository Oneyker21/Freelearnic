import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppNavigator from "./navigation/appnavigator";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}