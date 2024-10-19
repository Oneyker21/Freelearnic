import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HomeScreenCliente from '../screens/cliente/HomeScreenClient';
import HomeScreenFreelancer from '../screens/freelancer/HomeScreenFreelancer';
import VerificationScreen from '../screens/VerificationScreen';
import ScreenTypeUser from '../screens/ScreenTypeUser';

const Tab = createBottomTabNavigator();
const HomeStackNavigator = createNativeStackNavigator();


function Mystack() {
  return (
    <HomeStackNavigator.Navigator initialRouteName='Home'>
      <HomeStackNavigator.Screen name="Home" component={HomeScreen} />
      <HomeStackNavigator.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
      <HomeStackNavigator.Screen name="HomeCliente" component={HomeScreenCliente} options={{headerShown: false}} />
      <HomeStackNavigator.Screen name="HomeFreelancer" component={HomeScreenFreelancer} options={{headerShown: false}} />
      <HomeStackNavigator.Screen name="VerificationStatus" component={VerificationScreen} options={{headerShown: false}} />
      <HomeStackNavigator.Screen name="TypeUser" component={ScreenTypeUser} options={{headerShown: false}} />
    </HomeStackNavigator.Navigator>
  );
}


function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Mystack} options={{headerShown: false}} />
      <Tab.Screen name="HomeCliente" component={() => <HomeScreenCliente />} />
      <Tab.Screen name="HomeFreelancer" component={HomeScreenFreelancer} />
      <Tab.Screen name="VerificationStatus" component={VerificationScreen} />
      <Tab.Screen name="TypeUser" component={ScreenTypeUser} />
    </Tab.Navigator>
  );
}


export default function MainNavigator() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
