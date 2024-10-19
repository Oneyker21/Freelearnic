import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, View } from 'react-native';
import * as Font from 'expo-font';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans'; // Importar Open Sans
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import HomeScreenSb from './screens/client/HomeScreenClient';
import HomeScreenFreelancer from './screens/freelancer/HomeScreenFreelancer';
import RegisterFreelancer from './screens/freelancer/RegisterFreelancer';
import CreateProject from './screens/client/CreateProject';
import FreelancerProfile from './screens/freelancer/FreelancerProfile';
import VerificationStatus from './screens/VerificationScreen';
import HomeScreenClient from  './screens/client/HomeScreenClient'
import SelectProposal from './screens/client/SelectProposals';
import Grafico from './screens/client/Graficos';
import Messaging from './screens/Messaging';
import RegisterClient from './screens/client/RegisterClient';
import ScreenTypeUser from './screens/ScreenTypeUser';
import ClienteNavigator from './navigation/ClienteNavigator';


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
  /*   <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="SelectProposal" component={SelectProposal} options={{headerShow: false}}/>
        <Stack.Screen name="HomeScreenClient" component={HomeScreenClient} options={{headerShow: false}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ScreenTypeUser" component={ScreenTypeUser} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterClient" component={RegisterClient} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreenSb" component={HomeScreenSb} />
        <Stack.Screen name="FreelancerProfile" component={FreelancerProfile}/>
        <Stack.Screen name="HomeScreenFreelancer" component={HomeScreenFreelancer}options={{headerShow: false}}  />
        <Stack.Screen name="RegisterFreelancer" component={RegisterFreelancer} options={{ headerShown: false }} />
        <Stack.Screen name="CreateProject" component={CreateProject} />
        <Stack.Screen name="VerificationStatus" component={VerificationStatus} />
        <Stack.Screen name="GraficoProyecto" component={Grafico} />
        <Stack.Screen name="Messaging" component={Messaging} />
        <Stack.Screen name="TypeUser" component={ScreenTypeUser} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer> */
      <ClienteNavigator />

  );
};

export default ClienteNavigator;



