import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import HomeScreenClient from '../screens/cliente/HomeScreenClient';
import VerificationStatus from '../screens/VerificationScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Client') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Verification') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Client" component={HomeScreenClient} />
      <Tab.Screen name="Verification" component={VerificationStatus} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
