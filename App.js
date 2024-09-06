import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/freelancer/HomeScreen";
import RegisterUsers from "./screens/RegisterUsers";
import HomeScreenSb from "./screens/freelancer/HomeScreenSb";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inicio de sesión" component={LoginScreen} />
        <Stack.Screen name="Registrar Cuenta" component={RegisterUsers} />
        <Stack.Screen name="Inicio" component={HomeScreenSb} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;