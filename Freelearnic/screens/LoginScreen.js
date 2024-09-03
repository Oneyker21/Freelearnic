// src/screens/LoginScreen.js
import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { loginUser } from "../services/auth";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      // Verifica si loginUser está definida antes de llamarla
      if (typeof loginUser === 'function') {
        await loginUser(email, password);
      } else {
        console.error('loginUser no está definida o no es una función');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      {user && <Text>Welcome, {user.email}</Text>}
    </View>
  );
};

export default LoginScreen;
