import React from "react";
import { View, StyleSheet } from 'react-native';
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/freelancer/HomeScreen";
import RegisterUsers from "./screens/RegisterUsers";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();



const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Inicio de sesión" component={LoginScreen} />
        <Stack.Screen name="Inicio" component={HomeScreen} />
        <Stack.Screen name="Registrar Cuenta" component={RegisterUsers} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;