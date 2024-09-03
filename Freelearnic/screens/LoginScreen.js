// src/screens/LoginScreen.js
import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { loginUser } from "../services/auth.js";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      // Navigate to home or profile screen
    } catch (error) {
      console.error(error);
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
