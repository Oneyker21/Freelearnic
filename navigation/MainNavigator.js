import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text,ActivityIndicator, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDoc,doc,getStorage } from 'firebase/firestore';
// Importaciones de React Navigation para la navegación en la app
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';


// Importaciones de iconos para usar en la navegación
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
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
import ScreenTypeUser from '../screens/ScreenTypeUser';


const HomeMainNavigator = createStackNavigator();
function StackHomeMain() {
  return (
    <HomeMainNavigator.Navigator
      initialRouteName='HomeScreen'>
      <HomeMainNavigator.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

      <HomeMainNavigator.Screen
        name="SelectProposal"
        component={SelectProposals}
        options={{ headerShown: false, title: 'SelectProposal' }} // Opciones para la pantalla de registro
      />
      <HomeMainNavigator.Screen
        name="TypeUser"
        component={ScreenTypeUser}
        options={{ headerShown: false, title: 'TypeUser' }} // Opciones para la pantalla de registro
      />

      <HomeMainNavigator.Screen
        name="RegisterFreelancer"
        component={RegisterFreelancer}
        options={{ headerShown: false, title: 'RegisterFreelancer' }} // Opciones para la pantalla de registro
      />
         <HomeMainNavigator.Screen
        name="RegisterFreelancer2"
        component={RegisterFreelancer2}
        options={{ headerShown: false, title: 'RegisterFreelancer2' }} // Asegúrate de que esta pantalla esté configurada
      />

      <HomeMainNavigator.Screen
        name="RegisterClient"
        component={RegisterClient}
        options={{ headerShown: false, title: 'RegisterClient' }} // Opciones para la pantalla de registro
      />


      <HomeMainNavigator.Screen
        name="RegisterClient2"
        component={RegisterClient2}
        options={{ headerShown: false, title: 'RegisterClient2' }} // Opciones para la pantalla de registro
      />
   
         <HomeMainNavigator.Screen
        name="VerificationScreen"
        component={VerificationScreen}
        options={{ headerShown: false, title: 'StateVerification' }} // Opciones para la pantalla de inicio de sesión
      />

<HomeMainNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false, title: 'Login' }} // Opciones para la pantalla de inicio de sesión
      />

      <HomeMainNavigator.Screen
        name="TabsClient"
        component={TabsClient}
        options={{
          headerShown: false,
        }}
      />
      <HomeMainNavigator.Screen
        name="TabsFreelancer"
        component={TabsFreelancer}
        options={{
          headerShown: false,
        }}
      />
    </HomeMainNavigator.Navigator>
  )
}

const Tab = createBottomTabNavigator();
function TabsClient({ route }) {
  const { clientId } = route.params;

  return (
    <Tab.Navigator initialRouteName='HomeScreenClient'>
      <Tab.Screen
        name='HomeScreenClient'
        component={HomeScreenClient}
        initialParams={{ clientId }}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={30} color={color} />
          ),
          headerShown: false,
        }}
      />
               <Tab.Screen
        name='SearchFreelancers'
        component={SearchFreelancers}
        initialParams={{ clientId }}
        options={{
          tabBarLabel: 'Buscar Freelancers',
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={24} color="black" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name='CreateProject'
        component={CreateProject}
        initialParams={{ clientId }}
        options={{
          tabBarLabel: 'Crear Proyecto',
          tabBarIcon: ({ color, size }) => (

            <AntDesign name="pluscircleo" size={30} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name='Messaging'
        component={Messaging}
        initialParams={{ clientId }}
        options={{
          tabBarLabel: 'Mensajes',
          tabBarIcon: ({ color, size }) => (

            <AntDesign name="message1" size={30} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name='ClientProfile'
        component={ClientProfile}
        initialParams={{ clientId }}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
              <AntDesign name="message1" size={30} color={color} />
          ),
          headerShown: false,
        }}
      />
 
    </Tab.Navigator>
  );
};

const Tab2 = createBottomTabNavigator();
function TabsFreelancer({ route }) {
  const { freelancerId } = route.params;

  return (
    <Tab2.Navigator initialRouteName='HomeScreenFreelancer'>
    <Tab2.Screen
      name='HomeScreenFreelancer'
      component={HomeScreenFreelancer}
      initialParams={{ freelancerId }}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="home" size={30} color={color} />
        ),
        headerShown: false,
      }}
    />
      <Tab.Screen
        name='Messaging'
        component={Messaging}
        initialParams={{ freelancerId }}
        options={{
          tabBarLabel: 'Mensajes',
          tabBarIcon: ({ color, size }) => (

            <AntDesign name="message1" size={30} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name='FreelancerProfile'
        component={FreelancerProfile}
        initialParams={{ freelancerId }}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (

            <AntDesign name="message1" size={30} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab2.Navigator>
  )
};

// Componente principal que envuelve toda la navegación en un contenedor
export default function Navegacion() {
  const [isSessionActive, setIsSessionActive] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem('userSession');
      setIsSessionActive(session === 'active');
    };

    checkSession();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      async () => {
        const sessionActive = await AsyncStorage.getItem('userSession');
        if (sessionActive === 'active') {
          Alert.alert("¡Espera!", "¿Estás seguro de que quieres salir de la aplicación?", [
            {
              text: "Cancelar",
              onPress: () => null,
              style: "cancel"
            },
            { text: "Salir", onPress: () => BackHandler.exitApp() }
          ]);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, []);

  if (isSessionActive === null) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>;
  }

  return (
    <NavigationContainer>
      <StackHomeMain initialRouteName={isSessionActive ? 'TabsClient' : 'Login'} />
    </NavigationContainer>
  );
}
