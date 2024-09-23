import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, View } from 'react-native';
import * as Font from 'expo-font';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans'; // Importar Open Sans
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterUsers from './screens/cliente/RegisterUsers';
import HomeScreenSb from './screens/cliente/HomeScreenClient';
import HomeScreenFreelancer from './screens/freelancer/HomeScreenFreelancer';
import RegisterFreelancer from './screens/freelancer/RegisterFreelancer';
import CreateProject from './screens/cliente/CreateProject';
import FreelancerProfile from './screens/freelancer/FreelancerProfile';
import VerificationStatus from './screens/VerificationScreen';
import HomeScreenClient from  './screens/cliente/HomeScreenClient'

const Stack = createNativeStackNavigator();


const loadFonts = async () => {
  await Font.loadAsync({
    'Roboto-regular': Roboto_400Regular,
    'Roboto-bold': Roboto_700Bold,
    'OpenSans-regular': OpenSans_400Regular, // Cargar Open Sans Regular
    'OpenSans-bold': OpenSans_700Bold,       // Cargar Open Sans Bold
  });
};


const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadResources = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };

    loadResources();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="HomeScreenCliente" component={HomeScreenClient} options={{headerShow: false}} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inicio de sesión" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Registrar Cuenta" component={RegisterUsers} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreenSb" component={HomeScreenSb} />
        <Stack.Screen name="Profile Freelancer" component={FreelancerProfile}/>
        <Stack.Screen name="HomeScreenFreelancer" component={HomeScreenFreelancer} />
        <Stack.Screen name="Registrar Freelancer" component={RegisterFreelancer} options={{ headerShown: false }} />
        <Stack.Screen name="Crear Proyecto" component={CreateProject} />
        <Stack.Screen name="VerificationStatus" component={VerificationStatus} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
