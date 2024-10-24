import React, { useState, useEffect } from 'react';
import MainNavigator from './navigation/MainNavigator';
import * as Font from 'expo-font';

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
     /*<NavigationContainer>
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
      </Stack.Navigator> */
      <MainNavigator></MainNavigator>

  );
};

export default App;



