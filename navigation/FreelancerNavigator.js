import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/freelancer/HomeScreen";
import RegisterUsers  from "../screens/freelancer/RegisterUsers";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterUsers" component={RegisterUsers} />
        <Stack.Screen name="Inicio" component={HomeScreenSb} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};