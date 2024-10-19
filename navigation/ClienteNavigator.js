import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { db } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';


import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HomeScreenClient from '../screens/client/HomeScreenClient';

import HomeScreenFreelancer from '../screens/freelancer/HomeScreenFreelancer';
import VerificationScreen from '../screens/VerificationScreen';
import CreateProject from '../screens/client/CreateProject';
import SelectProposal from '../screens/client/SelectProposals';
import Grafico from '../screens/client/Graficos';
import RegisterClient from '../screens/client/RegisterClient';
import RegisterFreelancer from '../screens/freelancer/RegisterFreelancer';
import ScreenTypeUser from '../screens/ScreenTypeUser';
import ProjectList from '../screens/ProjectList';
import Messaging from '../screens/Messaging';


const Tab = createBottomTabNavigator();
const HomeStackNavigator = createNativeStackNavigator();

function Mystack({ clientId }) {
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const docRef = doc(db, 'Clients', clientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching client data: ', error);
      }
    };

    fetchClientData();
  }, [clientId]);

  return (
    <HomeStackNavigator.Navigator initialRouteName='Home'>
      <HomeStackNavigator.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} initialParams={{ clientId }} />

      <HomeStackNavigator.Screen name="RegisterClient" component={RegisterClient} options={{ headerShown: false }} initialParams={{ clientId }} />

      <HomeStackNavigator.Screen name="Login" component={LoginScreen} initialParams={{ clientId }} options={{ headerShown: false }} />

      <HomeStackNavigator.Screen name="HomeCliente" component={HomeScreenClient} initialParams={{ clientId }} options={{ headerShown: false }} />

      <HomeStackNavigator.Screen name="HomeFreelancer" component={HomeScreenFreelancer} initialParams={{ clientId }} options={{ headerShown: false }} />

      <HomeStackNavigator.Screen name="RegisterFreelancer" component={RegisterFreelancer} initialParams={{ clientId }} options={{ headerShown: false }} />

      <HomeStackNavigator.Screen name="CreateProject" component={CreateProject} initialParams={{ clientId }} options={{ headerShown: false }} />

      <HomeStackNavigator.Screen name="GraficoProyecto" component={Grafico} initialParams={{ clientId }} options={{ headerShown: false }} />

      <HomeStackNavigator.Screen name="Messaging" component={Messaging} initialParams={{ clientId }} options={{ headerShown: false }} />

      <HomeStackNavigator.Screen name="VerificationStatus" component={VerificationScreen} options={{ headerShown: 
      false }} />
      
      <HomeStackNavigator.Screen name="TypeUser" component={ScreenTypeUser} options={{ headerShown: 
      false }} />

    </HomeStackNavigator.Navigator>
  );
}


function MyTabs({ clientId, components }) {
  if (!components) {
    console.error("Components object is undefined");
    return null; // O manejar de otra manera que prefieras
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeCliente" component={() => <Mystack clientId={clientId} {...components} />} options={{ headerShown: false }} />

      <Tab.Screen name="HomeFreelancer" component={() => <Mystack FreelancerId={FreelancerId} {...components} />} options={{ headerShown: false }} />

      <Tab.Screen name="SelectProposal" component={SelectProposal} initialParams={{ clientId }} />
      <Tab.Screen name="CreateProject" component={components.CreateProject} initialParams={{ clientId }} />
      <Tab.Screen name="GraficoProyecto" component={Grafico} initialParams={{ clientId }} />
      <Tab.Screen name="Messaging" component={Messaging} initialParams={{ clientId }} />
    </Tab.Navigator>
  );
}


export default function MainNavigator({ components = {
  HomeScreenCliente: HomeScreenClient,
  HomeScreenFreelancer: HomeScreenFreelancer,
  VerificationScreen: VerificationScreen,
  CreateProject: CreateProject,
  SelectProposal: SelectProposal,
  RegisterClient: RegisterClient,
  RegisterFreelancer: RegisterFreelancer,
  Messaging: Messaging,
  // otros componentes necesarios
} }) {
  const clientId = {clientId}; // Asegúrate de obtener este valor correctamente

  return (
    <NavigationContainer>
      <MyTabs clientId={clientId} components={components} />
    </NavigationContainer>
  );
}
