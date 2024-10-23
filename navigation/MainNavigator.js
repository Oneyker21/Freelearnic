import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';


// Importaciones de React Navigation para la navegación en la app
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator} from '@react-navigation/stack';


// Importaciones de iconos para usar en la navegación
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';

// Importaciones de todas las pantallas a usar en la navegación Cliente
import HomeScreenClient from '../screens/client/HomeScreenClient';
import RegisterClient from '../screens/client/RegisterClient';
import RegisterClient2 from '../screens/client/RegisterClient2';
import CreateProject from '../screens/client/CreateProject';
import SelectProposals from '../screens/client/SelectProposals';
import Grafico from '../screens/client/Graficos';
import ClientProfile from '../screens/client/ClientProfile';
import SearchFreelancers from '../screens/client/SearchFreelancers';
import RateFreelancer from '../screens/client/RateFreelancer';


// Importaciones de todas las pantallas a usar en la navegación Freelancer
import FreelancerProfile from '../screens/freelancer/FreelancerProfile';
import HomeScreenFreelancer from '../screens/freelancer/HomeScreenFreelancer';
import ProposalModal from '../screens/freelancer/ProposalModal';
import RegisterFreelancer from '../screens/freelancer/RegisterFreelancer';
import RegisterFreelancer2 from '../screens/freelancer/RegisterFreelancer2';
import SearchProject from '../screens/freelancer/SearchProjects';


// Importaciones universales
import LoginScreen from '../screens/LoginScreen';
import EscrowPayment from '../screens/EscrowPayments';
import HomeScreen from '../screens/HomeScreen';
import VerificationScreen from '../screens/VerificationScreen';
import Messaging from '../screens/Messaging';
import SelectDeparMuni from '../screens/SelectDeparMuni';
import ProjectListSB from '../screens/ProjectListSB';
import ProjectList from '../screens/ProjectList';
import Notifications from '../screens/Notifications';


const HomeMainNavigator = createStackNavigator();
function StackHomeMain(){
  return(
    <HomeMainNavigator.Navigator
      initialRouteName='HomeScreen'>
        <HomeMainNavigator.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown:false,
          }}
        />
        <HomeMainNavigator.Screen
          name="TabsClient"
          component={TabsClient}
          options={{
            headerShown:false,
          }}
        />
        <HomeMainNavigator.Screen
          name="TabsFreelancer"
          component={TabsFreelancer}
          options={{
            headerShown:false,
          }}
        />
    </HomeMainNavigator.Navigator>
  )
}

const Tab = createBottomTabNavigator();
function TabsClient(){
  return(
    <Tab.Navigator
      initialRouteName='HomeScreenClient'
      screenOptions={{
        tabBarActiveTintColor: 'purple',
      }}
    >
        <Tab.Screen name='HomeScreenClient' component={HomeScreenClient} 
          options={{
            tabBarLabel:'Home',
            tabBarIcon: ({color, size})=> (
              <AntDesign name="home" size={30} color={color} />
            ),
            headerShown:false,
          }}
        />
        <Tab.Screen name='CreateProject' component={CreateProject} 
         options={{
            tabBarLabel:'Crear proyecto',
            tabBarIcon: ({color, size})=> (
              <AntDesign name="setting" size={30} color={color} />
            ),
            headerShown:false,
          }}
        />
        <Tab.Screen name='SelectProposals' component={SelectProposals} 
         options={{
          tabBarLabel:'Seleccionar propuestas',
          tabBarIcon: ({color, size})=> (
            <Fontisto name="shopping-basket-add" size={24} color={color} />
          ),
          headerShown:false,
        }}
      />
        <Tab.Screen name='Messaging' component={Messaging} 
         options={{
            tabBarLabel:'Mensajes',
            tabBarIcon: ({color, size})=> (
              <Ionicons name="add-circle" size={24} color="black" />
            ),
            headerShown:false,
          }}
        />
    </Tab.Navigator>
  )
};


const Tab2 = createBottomTabNavigator();
function TabsFreelancer(){
  return(
    <Tab2.Navigator
      initialRouteName='HomeScreenFreelancer'
      screenOptions={{
        tabBarActiveTintColor: 'purple',
        headerShown:false,
      }}
    >
        <Tab2.Screen name='Home' component={Home} 
          options={{
            tabBarLabel:'Home',
            tabBarIcon: ({color, size})=> (
              <AntDesign name="home" size={30} color={color} />
            ),
            headerShown:false,
          }}
        />
        <Tab2.Screen name='Users' component={Users} 
         options={{
          tabBarLabel:'Listar productos',
          tabBarIcon: ({color, size})=> (
            <Fontisto name="shopping-basket-add" size={24} color={color} />
          ),
          headerShown:false,
        }}
      />
    </Tab2.Navigator>
  )
};

// Componente principal que envuelve toda la navegación en un contenedor
export default function Navegacion() {
  return (
   <NavigationContainer>
    <StackHomeMain ></StackHomeMain>
  </NavigationContainer>
  )
}