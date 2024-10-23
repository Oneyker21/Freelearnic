import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, View } from 'react-native';
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
import RegisterFreelancer2 from './screens/freelancer/RegisterFreelancer2';
import RegisterClient2 from './screens/client/RegisterClient2';
import * as Font from 'expo-font';

const Stack = createNativeStackNavigator();


const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Roboto-regular': require('./fonts/Roboto-Regular.ttf'),
        'OpenSans-regular': require('./fonts/OpenSans-Regular.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // O muestra algún tipo de pantalla de carga
  }

  return (
     <NavigationContainer>
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
        <Stack.Screen name="CreateProject" component={CreateProject}  options={{headerShow: false}} />
        <Stack.Screen name="VerificationStatus" component={VerificationStatus} />
        <Stack.Screen name="GraficoProyecto" component={Grafico} />
        <Stack.Screen name="Messaging" component={Messaging} />
        <Stack.Screen name="TypeUser" component={ScreenTypeUser} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer> 



  );
};

export default App;



