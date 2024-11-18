import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  BackHandler,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDoc, doc, getStorage } from "firebase/firestore";
// Importaciones de React Navigation para la navegación en la app
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Dimensions } from "react-native";

// Importaciones de iconos para usar en la navegación
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";

// Importaciones de todas las pantallas a usar en la navegación Cliente
import HomeScreenClient from '../screens/client/HomeScreenClient';
import RegisterClient from '../screens/client/RegisterClient';
import RegisterClient2 from '../screens/client/RegisterClient2';
import CreateProject from '../screens/client/CreateProject';
import SelectProposals from '../screens/client/SelectProposals';
import ClientProfile from '../screens/client/ClientProfile';
import SearchFreelancers from '../screens/client/SearchFreelancers';
import RateFreelancer from '../screens/client/RateFreelancer';
import FreelancerListChat from '../screens/client/FreelancerListChat';
import PanelPayClients from '../screens/client/PanelPayClients';
import PanelUserClient from "../screens/client/PanelUserClient";


// Importaciones de todas las pantallas a usar en la navegación Freelancer
import FreelancerProfile from '../screens/freelancer/FreelancerProfile';
import HomeScreenFreelancer from '../screens/freelancer/HomeScreenFreelancer';
import ProposalModal from '../screens/freelancer/ProposalModal';
import RegisterFreelancer from '../screens/freelancer/RegisterFreelancer';
import RegisterFreelancer2 from '../screens/freelancer/RegisterFreelancer2';
import SearchProject from '../screens/freelancer/SearchProjects';
import ClientList from '../screens/freelancer/ClientList';
import PanelPay from '../screens/freelancer/PanelPay';
import PanelUserFreelancer from '../screens/freelancer/PanelUserFreelancer';


// Importaciones universales
import LoginScreen from "../screens/main/LoginScreen";
import EscrowPayment from "../screens/main/EscrowPayments";
import HomeScreen from "../screens/main/HomeScreen";
import VerificationScreen from "../screens/main/VerificationScreen";
import Messaging from "../screens/main/Messaging";
import SelectDeparMuni from "../screens/main/SelectDeparMuni";
import ProjectListSB from "../screens/main/ProjectListSB";
import ProjectList from "../screens/main/ProjectList";
import Notifications from "../screens/main/Notifications";
import ScreenTypeUser from "../screens/main/ScreenTypeUser";

// Importaciones de todas las pantallas a usar en la navegación Admininstrador
import Reports from "../screens/admin/Reports";
import UserVerification from "../screens/admin/UserVerification"

const HomeMainNavigator = createStackNavigator();
function StackHomeMain() {
  return (
    <HomeMainNavigator.Navigator initialRouteName="HomeScreen">
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
        options={{ headerShown: false, title: "SelectProposal" }} // Opciones para la pantalla de registro
      />
      <HomeMainNavigator.Screen
        name="TypeUser"
        component={ScreenTypeUser}
        options={{ headerShown: false, title: "TypeUser" }} // Opciones para la pantalla de registro
      />

      <HomeMainNavigator.Screen
        name="RegisterFreelancer"
        component={RegisterFreelancer}
        options={{ headerShown: false, title: "RegisterFreelancer" }} // Opciones para la pantalla de registro
      />
      <HomeMainNavigator.Screen
        name="RegisterFreelancer2"
        component={RegisterFreelancer2}
        options={{ headerShown: false, title: "RegisterFreelancer2" }} // Asegúrate de que esta pantalla esté configurada
      />

      <HomeMainNavigator.Screen
        name="RegisterClient"
        component={RegisterClient}
        options={{ headerShown: false, title: "RegisterClient" }} // Opciones para la pantalla de registro
      />

      <HomeMainNavigator.Screen
        name="RegisterClient2"
        component={RegisterClient2}
        options={{ headerShown: false, title: "RegisterClient2" }} // Opciones para la pantalla de registro
      />

      <HomeMainNavigator.Screen
        name="VerificationScreen"
        component={VerificationScreen}
        options={{ headerShown: false, title: "StateVerification" }} // Opciones para la pantalla de inicio de sesión
      />

      <HomeMainNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false, title: "Login" }} // Opciones para la pantalla de inicio de sesión
      />

<HomeMainNavigator.Screen
        name="ChatScreen"
        component={Messaging}
        options={{ headerShown: false, title: "ChatScreen" }} // Opciones para la pantalla de inicio de sesión
      />

<HomeMainNavigator.Screen
        name="ClientProfile"
        component={ClientProfile}
        options={{
          headerShown: false,
        }}
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

<HomeMainNavigator.Screen
        name="TabsAdmin"
        component={TabsAdmin}
        options={{
          headerShown: false,
        }}
      />

<HomeMainNavigator.Screen
        name="FreelancerProfile"
        component={FreelancerProfile}
        options={{
          headerShown: false,
        }}
      />
    </HomeMainNavigator.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

function TabsClient({ route }) {
  const { clientId } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="HomeScreenClient"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: windowHeight * 0.02, // 2% desde el fondo
          left: windowWidth * 0.022,
          right: windowWidth * 0.027,
          backgroundColor: "#007bff",
          borderRadius: 20,
          height: windowHeight * 0.08, // 8% de la altura de la pantalla
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
          elevation: 5,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreenClient"
        component={HomeScreenClient}
        initialParams={{ clientId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: windowWidth * 0.12,
                height: windowWidth * 0.12,
                borderRadius: windowWidth * 0.06,
                backgroundColor: focused
                  ? "rgba(255, 255, 255, 0.3)"
                  : "transparent",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: windowWidth * 0.002,
              }}
            >
              <Image
                source={require("../assets/iconsNavigation/Inicio.png")}
                style={{
                  width: windowWidth * 0.06,
                  height: windowWidth * 0.06,
                  marginBottom: windowWidth * 0.01,
                  tintColor: focused ? "#007bff" : "#ffffff",
                }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="SearchFreelancers"
        component={SearchFreelancers}
        initialParams={{ clientId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: windowWidth * 0.12,
                height: windowWidth * 0.12,
                borderRadius: windowWidth * 0.06,
                backgroundColor: focused
                  ? "rgba(255, 255, 255, 0.3)"
                  : "transparent",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: windowWidth * 0.001,
              }}
            >
              <Image
                source={require("../assets/iconsNavigation/Freelancers.png")}
                style={{
                  width: windowWidth * 0.08,
                  height: windowWidth * 0.08,
                  marginTop: windowWidth * 0.015,
                  tintColor: focused ? "#007bff" : "#ffffff",
                }}
              />
            </View>
          ),
          headerShown: false,
        }}
        
      />

<Tab.Screen
        name="PanelPayClients"
        component={PanelPayClients}
        initialParams={{ clientId }}
        options={{
          tabBarIcon: ({}) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: windowWidth * 0.002,
              }}
            >
              <Image
                source={require("../assets/iconsNavigation/Nuevo.png")}
                style={{
                  width: windowWidth * 0.13,
                  height: windowWidth * 0.13,
                }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="CreateProject"
        component={CreateProject}
        initialParams={{ clientId }}
        options={{
          tabBarIcon: ({}) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: windowWidth * 0.002,
              }}
            >
              <Image
                source={require("../assets/iconsNavigation/Nuevo.png")}
                style={{
                  width: windowWidth * 0.13,
                  height: windowWidth * 0.13,
                }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />

<Tab.Screen
        name='SelectProposal'
        component={SelectProposals}
        initialParams={{ clientId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: windowWidth * 0.12,
                height: windowWidth * 0.12,
                borderRadius: windowWidth * 0.06,
                backgroundColor: focused
                  ? "rgba(255, 255, 255, 0.3)"
                  : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/iconsNavigation/Mensaje.png")}
                style={{
                  width: windowWidth * 0.085,
                  height: windowWidth * 0.085,
                  marginRight: windowWidth * 0.004,
                  tintColor: focused ? "#007bff" : "#ffffff",
                }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name='FreelancerListChat'
        component={FreelancerListChat}
        initialParams={{ clientId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: windowWidth * 0.12,
                height: windowWidth * 0.12,
                borderRadius: windowWidth * 0.06,
                backgroundColor: focused
                  ? "rgba(255, 255, 255, 0.3)"
                  : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/iconsNavigation/Mensaje.png")}
                style={{
                  width: windowWidth * 0.085,
                  height: windowWidth * 0.085,
                  marginRight: windowWidth * 0.004,
                  tintColor: focused ? "#007bff" : "#ffffff",
                }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="PanelUserClient"
        component={PanelUserClient}
        initialParams={{ clientId }}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: windowWidth * 0.12,
                height: windowWidth * 0.12,
                borderRadius: windowWidth * 0.06,
                backgroundColor: focused
                  ? "rgba(255, 255, 255, 0.3)"
                  : "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/iconsNavigation/Perfil.png")}
                style={{
                  width: windowWidth * 0.08,
                  height: windowWidth * 0.08,
                  marginTop: windowWidth * - 0.01,
                  tintColor: focused ? "#007bff" : "#ffffff",
                }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const Tab2 = createBottomTabNavigator();
function TabsFreelancer({ route }) {
  const { freelancerId } = route.params;

  return (
    <Tab2.Navigator initialRouteName="HomeScreenFreelancer">
      <Tab2.Screen
        name="HomeScreenFreelancer"
        component={HomeScreenFreelancer}
        initialParams={{ freelancerId }}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={30} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name='ClientList'
        component={ClientList}
        initialParams={{ freelancerId }}
        options={{
          tabBarLabel: "Mensajes",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="message1" size={30} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name='PanelPay'
        component={PanelPay}
        initialParams={{ freelancerId }}
        options={{
          tabBarLabel: "Transacciones",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="payments" size={24} color="black" />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="PanelUserFreelancer"
        component={PanelUserFreelancer}
        initialParams={{ freelancerId }}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="message1" size={30} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab2.Navigator>
  );
}

const Tab3 = createBottomTabNavigator();
function TabsAdmin({ route }) {
  const { AdminId } = route.params;

  return (
    <Tab3.Navigator initialRouteName="Reports">
      <Tab3.Screen
        name="Reports"
        component={Reports}
        initialParams={{ AdminId }}
        options={{
          tabBarLabel: "Reportes",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bar-chart-o" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />

<Tab3.Screen
        name="UserVerification"
        component={UserVerification}
        initialParams={{ AdminId }}
        options={{
          tabBarLabel: "Reportes",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bar-chart-o" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tab3.Navigator>
  );
}

// Componente principal que envuelve toda la navegación en un contenedor
export default function Navegacion() {
  const [isSessionActive, setIsSessionActive] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem("userSession");
      setIsSessionActive(session === "active");
    };

    checkSession();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      async () => {
        const sessionActive = await AsyncStorage.getItem("userSession");
        if (sessionActive === "active") {
          Alert.alert(
            "¡Espera!",
            "¿Estás seguro de que quieres salir de la aplicación?",
            [
              {
                text: "Cancelar",
                onPress: () => null,
                style: "cancel",
              },
              { text: "Salir", onPress: () => BackHandler.exitApp() },
            ]
          );
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, []);

  if (isSessionActive === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StackHomeMain
        initialRouteName={isSessionActive ? "TabsClient" : "Login"}
      />
    </NavigationContainer>
  );
}
